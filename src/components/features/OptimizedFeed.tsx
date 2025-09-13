'use client';

import React, { useCallback, useMemo } from 'react';
import { useInView } from 'react-intersection-observer';
import { usePostsQuery, useLikePostMutation, useIncrementViewsMutation } from '@/lib/hooks/usePostsQuery';
import PostCard from './PostCard';
import { PostFilters } from '@/lib/hooks/usePostsQuery';
import { useAuth } from '@/lib/hooks/useAuth';
import { PageLoadingState } from '@/components/ui/LoadingState';

interface OptimizedFeedProps {
    filters: PostFilters;
    onNavigateToProfile?: (userId: string) => void;
    onPostDeleted?: (postId: string) => void;
    onPostUpdated?: (postId: string, updatedPost: any) => void;
}

const OptimizedFeed: React.FC<OptimizedFeedProps> = ({
    filters,
    onNavigateToProfile,
    onPostDeleted,
    onPostUpdated
}) => {
    const { user } = useAuth();
    const { ref: loadMoreRef, inView } = useInView({
        threshold: 0.1,
        rootMargin: '100px',
    });

    // Fetch posts with infinite scroll
    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error,
        refetch
    } = usePostsQuery(filters);

    // Mutations for optimistic updates
    const likePostMutation = useLikePostMutation();
    const incrementViewsMutation = useIncrementViewsMutation();

    // Flatten all posts from all pages
    const posts = useMemo(() => {
        return data?.pages.flatMap(page => page.posts) || [];
    }, [data]);

    // Handle like with optimistic updates
    const handleLikeChange = useCallback((postId: string, newLikes: number, newLikedBy: string[]) => {
        if (!user) return;

        const isLiked = newLikedBy.includes(user.uid);
        likePostMutation.mutate({
            postId,
            userId: user.uid,
            isLiked: !isLiked
        });
    }, [user, likePostMutation]);

    // Handle view increment
    const handlePostView = useCallback((postId: string) => {
        incrementViewsMutation.mutate(postId);
    }, [incrementViewsMutation]);

    // Load more when scrolling to bottom
    React.useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    if (isLoading) {
        return <PageLoadingState />;
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-red-400 mb-4">Failed to load posts</p>
                <button
                    onClick={() => refetch()}
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12">
                <p className="text-slate-400 mb-2">No posts found</p>
                <p className="text-slate-500 text-sm">Try adjusting your filters or check back later</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Posts List */}
            {posts.map((post, index) => (
                <PostCard
                    key={post.id}
                    post={post}
                    onLikeChange={handleLikeChange}
                    onNavigateToProfile={onNavigateToProfile}
                    onPostDeleted={onPostDeleted}
                    onPostUpdated={onPostUpdated}
                />
            ))}

            {/* Load More Trigger */}
            {hasNextPage && (
                <div ref={loadMoreRef} className="flex justify-center py-8">
                    {isFetchingNextPage ? (
                        <div className="flex items-center gap-2 text-slate-400">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
                            Loading more posts...
                        </div>
                    ) : (
                        <button
                            onClick={() => fetchNextPage()}
                            className="px-6 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg transition-colors"
                        >
                            Load More
                        </button>
                    )}
                </div>
            )}

            {/* End of feed indicator */}
            {!hasNextPage && posts.length > 0 && (
                <div className="text-center py-8">
                    <p className="text-slate-500">You've reached the end of the feed</p>
                </div>
            )}
        </div>
    );
};

export default React.memo(OptimizedFeed);
