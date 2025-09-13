import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    collection,
    query,
    orderBy,
    limit,
    startAfter,
    where,
    getDocs,
    DocumentSnapshot,
    doc,
    updateDoc,
    increment,
    arrayUnion,
    arrayRemove
} from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { Post } from '@/lib/types';

// Query keys for consistent caching
export const postKeys = {
    all: ['posts'] as const,
    lists: () => [...postKeys.all, 'list'] as const,
    list: (filters: PostFilters) => [...postKeys.lists(), filters] as const,
    details: () => [...postKeys.all, 'detail'] as const,
    detail: (id: string) => [...postKeys.details(), id] as const,
    user: (userId: string) => [...postKeys.all, 'user', userId] as const,
};

export interface PostFilters {
    sport?: string;
    timeRange?: string;
    tags?: string[];
    userId?: string;
}

// Fetch posts with pagination
const fetchPosts = async (
    pageParam: DocumentSnapshot | null = null,
    filters: PostFilters = {}
): Promise<{ posts: Post[]; nextCursor: DocumentSnapshot | null }> => {
    const postsCollection = collection(db, 'posts');
    let q = query(
        postsCollection,
        orderBy('createdAt', 'desc'),
        limit(10) // Load 10 posts per page
    );

    // Apply filters
    if (filters.sport && filters.sport !== 'All Sports') {
        q = query(q, where('sport', '==', filters.sport));
    }

    if (filters.userId) {
        q = query(q, where('userId', '==', filters.userId));
    }

    // Apply pagination
    if (pageParam) {
        q = query(q, startAfter(pageParam));
    }

    const snapshot = await getDocs(q);
    const posts = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    })) as Post[];

    const nextCursor = snapshot.docs[snapshot.docs.length - 1] || null;

    return { posts, nextCursor };
};

// Hook for infinite scroll posts with pagination
export const usePostsQuery = (filters: PostFilters = {}) => {
    return useInfiniteQuery({
        queryKey: postKeys.list(filters),
        queryFn: ({ pageParam }) => fetchPosts(pageParam as DocumentSnapshot | null, filters),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: null as DocumentSnapshot | null,
        staleTime: 2 * 60 * 1000, // 2 minutes for posts
        gcTime: 10 * 60 * 1000, // 10 minutes cache
    });
};

// Hook for user's posts
export const useUserPostsQuery = (userId: string) => {
    return useInfiniteQuery({
        queryKey: postKeys.user(userId),
        queryFn: ({ pageParam }) => fetchPosts(pageParam as DocumentSnapshot | null, { userId }),
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialPageParam: null as DocumentSnapshot | null,
        staleTime: 5 * 60 * 1000, // 5 minutes for user posts
        gcTime: 15 * 60 * 1000, // 15 minutes cache
    });
};

// Hook for single post
export const usePostQuery = (postId: string) => {
    return useQuery({
        queryKey: postKeys.detail(postId),
        queryFn: async () => {
            const postDoc = doc(db, 'posts', postId);
            const snapshot = await getDocs(query(collection(db, 'posts'), where('__name__', '==', postId)));
            if (snapshot.empty) throw new Error('Post not found');
            return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Post;
        },
        enabled: !!postId,
        staleTime: 5 * 60 * 1000,
    });
};

// Optimistic mutations for likes and views
export const useLikePostMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ postId, userId, isLiked }: { postId: string; userId: string; isLiked: boolean }) => {
            const postRef = doc(db, 'posts', postId);

            if (isLiked) {
                await updateDoc(postRef, {
                    likes: increment(-1),
                    likedBy: arrayRemove(userId)
                });
            } else {
                await updateDoc(postRef, {
                    likes: increment(1),
                    likedBy: arrayUnion(userId)
                });
            }
        },
        onMutate: async ({ postId, userId, isLiked }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: postKeys.detail(postId) });

            // Snapshot previous value
            const previousPost = queryClient.getQueryData(postKeys.detail(postId));

            // Optimistically update
            queryClient.setQueryData(postKeys.detail(postId), (old: Post | undefined) => {
                if (!old) return old;
                return {
                    ...old,
                    likes: isLiked ? old.likes - 1 : old.likes + 1,
                    likedBy: isLiked
                        ? old.likedBy.filter(id => id !== userId)
                        : [...old.likedBy, userId]
                };
            });

            // Also update in lists
            queryClient.invalidateQueries({ queryKey: postKeys.lists() });

            return { previousPost };
        },
        onError: (err, variables, context) => {
            // Rollback on error
            if (context?.previousPost) {
                queryClient.setQueryData(postKeys.detail(variables.postId), context.previousPost);
            }
        },
        onSettled: (data, error, variables) => {
            // Always refetch after error or success
            queryClient.invalidateQueries({ queryKey: postKeys.detail(variables.postId) });
        },
    });
};

export const useIncrementViewsMutation = () => {
    return useMutation({
        mutationFn: async (postId: string) => {
            const postRef = doc(db, 'posts', postId);
            await updateDoc(postRef, {
                views: increment(1)
            });
        },
        // Don't need optimistic updates for views
    });
};
