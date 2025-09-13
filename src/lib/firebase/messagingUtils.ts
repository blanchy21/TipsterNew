import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    limit,
    serverTimestamp,
    doc,
    updateDoc,
    getDocs,
    getDoc,
    setDoc,
    arrayUnion,
    arrayRemove,
    writeBatch
} from 'firebase/firestore';
import { db } from './firebase';
import { Message, Conversation, User } from '@/lib/types';

// Create a new conversation between two users
export const createConversation = async (participantIds: string[]): Promise<string> => {
    if (!db) throw new Error('Firebase not initialized');

    const conversationData = {
        participants: participantIds,
        lastMessage: null,
        unreadCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    const docRef = await addDoc(collection(db, 'conversations'), conversationData);
    return docRef.id;
};

// Get or create conversation between two users
export const getOrCreateConversation = async (user1Id: string, user2Id: string): Promise<string> => {
    if (!db) throw new Error('Firebase not initialized');

    // Check if conversation already exists
    const conversationsRef = collection(db, 'conversations');
    const q = query(
        conversationsRef,
        where('participants', 'array-contains', user1Id)
    );

    const snapshot = await getDocs(q);

    for (const doc of snapshot.docs) {
        const data = doc.data();
        if (data.participants.includes(user2Id)) {
            return doc.id;
        }
    }

    // Create new conversation if none exists
    return await createConversation([user1Id, user2Id]);
};

// Send a message in a conversation
export const sendMessage = async (
    conversationId: string,
    senderId: string,
    content: string,
    type: 'text' | 'image' | 'file' = 'text'
): Promise<string> => {
    if (!db) throw new Error('Firebase not initialized');

    const messageData = {
        conversationId,
        senderId,
        content: content.trim(),
        type,
        read: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
    };

    const messageRef = await addDoc(collection(db, 'messages'), messageData);

    // Update conversation with last message
    await updateDoc(doc(db, 'conversations', conversationId), {
        lastMessage: {
            id: messageRef.id,
            content: content.trim(),
            senderId,
            type,
            createdAt: serverTimestamp()
        },
        updatedAt: serverTimestamp()
    });

    return messageRef.id;
};

// Get messages for a conversation
export const getMessages = async (conversationId: string): Promise<Message[]> => {
    if (!db) throw new Error('Firebase not initialized');

    const messagesRef = collection(db, 'messages');
    const q = query(
        messagesRef,
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'asc'),
        limit(100)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            ...data,
            timestamp: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
        } as Message;
    });
};

// Get conversations for a user
export const getConversations = async (userId: string): Promise<Conversation[]> => {
    if (!db) throw new Error('Firebase not initialized');

    const conversationsRef = collection(db, 'conversations');
    const q = query(
        conversationsRef,
        where('participants', 'array-contains', userId),
        orderBy('updatedAt', 'desc'),
        limit(50)
    );

    const snapshot = await getDocs(q);
    const conversations = [];

    for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data();
        const otherParticipantId = data.participants.find((id: string) => id !== userId);

        // Get other participant's user data
        const userDoc = await getDoc(doc(db, 'users', otherParticipantId));
        const userData = userDoc.data() as any;

        if (userData) {
            conversations.push({
                id: docSnapshot.id,
                participants: [
                    {
                        id: userId,
                        name: 'You',
                        handle: '@you',
                        avatar: ''
                    },
                    {
                        id: otherParticipantId,
                        name: userData.displayName || userData.name || 'Unknown',
                        handle: userData.handle || `@user${otherParticipantId.slice(0, 8)}`,
                        avatar: userData.photoURL || userData.avatar || ''
                    }
                ],
                lastMessage: data.lastMessage ? {
                    id: data.lastMessage.id,
                    senderId: data.lastMessage.senderId,
                    receiverId: data.lastMessage.senderId === userId ? otherParticipantId : userId,
                    content: data.lastMessage.content,
                    timestamp: data.lastMessage.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                    read: data.lastMessage.senderId === userId, // If current user sent it, it's read
                    type: data.lastMessage.type || 'text'
                } : null,
                unreadCount: data.unreadCount || 0,
                updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
            });
        }
    }

    return conversations;
};

// Mark messages as read
export const markMessagesAsRead = async (conversationId: string, userId: string): Promise<void> => {
    if (!db) throw new Error('Firebase not initialized');

    const messagesRef = collection(db, 'messages');
    const q = query(
        messagesRef,
        where('conversationId', '==', conversationId),
        where('senderId', '!=', userId),
        where('read', '==', false)
    );

    const snapshot = await getDocs(q);
    const batch = writeBatch(db);

    snapshot.docs.forEach(doc => {
        batch.update(doc.ref, { read: true });
    });

    // Update conversation unread count
    batch.update(doc(db, 'conversations', conversationId), {
        unreadCount: 0,
        updatedAt: serverTimestamp()
    });

    await batch.commit();
};

// Set up real-time listener for messages in a conversation
export const subscribeToMessages = (
    conversationId: string,
    callback: (messages: Message[]) => void
): (() => void) => {
    if (!db) {
        console.error('Firebase not initialized');
        return () => { };
    }

    const messagesRef = collection(db, 'messages');
    const q = query(
        messagesRef,
        where('conversationId', '==', conversationId),
        orderBy('createdAt', 'asc'),
        limit(100)
    );

    return onSnapshot(q, (snapshot) => {
        const messages = snapshot.docs.map(doc => {
            const data = doc.data();
            return {
                id: doc.id,
                ...data,
                timestamp: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString()
            } as Message;
        });

        callback(messages);
    }, (error) => {
        console.error('Error listening to messages:', error);
    });
};

// Set up real-time listener for conversations
export const subscribeToConversations = (
    userId: string,
    callback: (conversations: Conversation[]) => void
): (() => void) => {
    if (!db || !userId) {
        console.error('Firebase not initialized or userId missing');
        return () => { };
    }

    const conversationsRef = collection(db, 'conversations');

    // Use simpler query to avoid index issues and permissions problems
    const q = query(
        conversationsRef,
        where('participants', 'array-contains', userId),
        limit(50)
    );

    return onSnapshot(q, (snapshot) => {
        const processConversations = async () => {
            try {
                const conversations = [];

                // If no conversations, call callback immediately with empty array
                if (snapshot.docs.length === 0) {
                    callback([]);
                    return;
                }

                for (const docSnapshot of snapshot.docs) {
                    const data = docSnapshot.data();
                    const otherParticipantId = data.participants.find((id: string) => id !== userId);

                    if (!otherParticipantId) {
                        continue;
                    }

                    // Get other participant's user data
                    const userDoc = await getDoc(doc(db, 'users', otherParticipantId));
                    const userData = userDoc.data() as any;

                    if (userData) {
                        conversations.push({
                            id: docSnapshot.id,
                            participants: [
                                {
                                    id: userId,
                                    name: 'You',
                                    handle: '@you',
                                    avatar: ''
                                },
                                {
                                    id: otherParticipantId,
                                    name: userData.displayName || userData.name || 'Unknown',
                                    handle: userData.handle || `@user${otherParticipantId.slice(0, 8)}`,
                                    avatar: userData.photoURL || userData.avatar || ''
                                }
                            ],
                            lastMessage: data.lastMessage ? {
                                id: data.lastMessage.id,
                                senderId: data.lastMessage.senderId,
                                receiverId: data.lastMessage.senderId === userId ? otherParticipantId : userId,
                                content: data.lastMessage.content,
                                timestamp: data.lastMessage.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
                                read: data.lastMessage.senderId === userId,
                                type: data.lastMessage.type || 'text'
                            } : null,
                            unreadCount: data.unreadCount || 0,
                            updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString()
                        });
                    }
                }

                // Sort conversations by updatedAt if we couldn't use orderBy in the query
                const sortedConversations = conversations.sort((a, b) =>
                    new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
                );

                callback(sortedConversations);
            } catch (error) {
                console.error('Error processing conversations:', error);
                callback([]); // Call callback with empty array on error
            }
        };

        processConversations();
    }, (error) => {
        // Only log permission errors, suppress other Firebase noise
        if (error.code === 'permission-denied') {
            console.error('Permission denied for conversations. User may not be authenticated:', error);
        } else if (!error.message?.includes('heartbeats') && !error.message?.includes('undefined')) {
            console.error('Error listening to conversations:', error);
        }
        callback([]); // Call callback with empty array on error
    });
};

// Search conversations
export const searchConversations = async (userId: string, searchQuery: string): Promise<Conversation[]> => {
    if (!db) throw new Error('Firebase not initialized');

    const conversations = await getConversations(userId);
    const query = searchQuery.toLowerCase();

    return conversations.filter(conversation => {
        const otherParticipant = conversation.participants.find(p => p.id !== userId);
        return (
            otherParticipant?.name.toLowerCase().includes(query) ||
            otherParticipant?.handle.toLowerCase().includes(query) ||
            conversation.lastMessage?.content.toLowerCase().includes(query)
        );
    });
};
