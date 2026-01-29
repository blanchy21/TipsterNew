'use client';

import { useState, useEffect } from 'react';
import { collection, query as firestoreQuery, orderBy as firestoreOrderBy, onSnapshot, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase/firebase';
import { Post } from '@/lib/types';
import { User as FirebaseUser } from 'firebase/auth';

export function useRealtimePosts(user: FirebaseUser | null, loading: boolean) {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    if (!db) {
      setPosts([]);
      return;
    }

    const postsRef = collection(db, 'posts');
    const q = firestoreQuery(
      postsRef,
      firestoreOrderBy('createdAt', 'desc'),
      limit(50)
    );

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        const postsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : data.createdAt
          } as Post;
        });

        const sortedPosts = postsData.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime();
          const dateB = new Date(b.createdAt).getTime();
          return dateB - dateA;
        });

        setPosts(sortedPosts);
      },
      () => {
        setPosts([]);
      }
    );

    return () => unsubscribe();
  }, [user, loading]);

  return { posts, setPosts };
}
