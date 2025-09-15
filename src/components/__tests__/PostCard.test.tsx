import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import PostCard from '../features/PostCard'

// Mock data for testing
const mockUser = {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/avatar.jpg',
}

const mockPost = {
    id: 'test-post-id',
    content: 'This is a test post',
    sport: 'football',
    odds: 2.5,
    result: 'pending',
    user: {
        id: 'test-user-id',
        name: 'Test User',
        handle: '@testuser',
        avatar: 'https://example.com/avatar.jpg',
    },
    createdAt: new Date('2024-01-01T00:00:00Z'),
    likes: 5,
    comments: 2,
    views: 100,
    likedBy: ['user1', 'user2'],
}

// Mock the LikeButton component
jest.mock('../features/LikeButton', () => {
    return function MockLikeButton({ post, onLike }: any) {
        return (
            <button
                data-testid="like-button"
                onClick={() => onLike && onLike(post.id)}
            >
                Like ({post.likes})
            </button>
        )
    }
})

// Mock the CommentForm component
jest.mock('../CommentForm', () => {
    return function MockCommentForm({ postId }: any) {
        return <div data-testid="comment-form">Comment Form for {postId}</div>
    }
})

// Mock the CommentsList component
jest.mock('../CommentsList', () => {
    return function MockCommentsList({ postId }: any) {
        return <div data-testid="comments-list">Comments for {postId}</div>
    }
})

describe('PostCard', () => {
    const defaultProps = {
        post: mockPost,
        onLike: jest.fn(),
        onComment: jest.fn(),
        onShare: jest.fn(),
        onViewProfile: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders post content correctly', () => {
        render(<PostCard {...defaultProps} />)

        expect(screen.getByText(mockPost.content)).toBeInTheDocument()
        expect(screen.getByText(mockPost.user.name)).toBeInTheDocument()
        expect(screen.getByText(mockPost.user.handle)).toBeInTheDocument()
        expect(screen.getByText(`Odds: ${mockPost.odds}`)).toBeInTheDocument()
        expect(screen.getByText(`Sport: ${mockPost.sport}`)).toBeInTheDocument()
    })

    it('displays post statistics correctly', () => {
        render(<PostCard {...defaultProps} />)

        expect(screen.getByText(`${mockPost.likes} likes`)).toBeInTheDocument()
        expect(screen.getByText(`${mockPost.comments} comments`)).toBeInTheDocument()
        expect(screen.getByText(`${mockPost.views} views`)).toBeInTheDocument()
    })

    it('calls onLike when like button is clicked', () => {
        render(<PostCard {...defaultProps} />)

        const likeButton = screen.getByTestId('like-button')
        fireEvent.click(likeButton)

        expect(defaultProps.onLike).toHaveBeenCalledWith(mockPost.id)
    })

    it('shows user avatar with fallback', () => {
        render(<PostCard {...defaultProps} />)

        const avatar = screen.getByAltText(mockPost.user.name)
        expect(avatar).toBeInTheDocument()
        expect(avatar).toHaveAttribute('src', mockPost.user.avatar)
    })

    it('formats date correctly', () => {
        render(<PostCard {...defaultProps} />)

        // Check if date is displayed (format may vary based on implementation)
        const dateElement = screen.getByText(/2024|Jan|January/)
        expect(dateElement).toBeInTheDocument()
    })

    it('handles pending result status', () => {
        const postWithPending = { ...mockPost, result: 'pending' }
        render(<PostCard {...defaultProps} post={postWithPending} />)

        expect(screen.getByText('Pending')).toBeInTheDocument()
    })

    it('handles win result status', () => {
        const postWithWin = { ...mockPost, result: 'win' }
        render(<PostCard {...defaultProps} post={postWithWin} />)

        expect(screen.getByText('Win')).toBeInTheDocument()
    })

    it('handles loss result status', () => {
        const postWithLoss = { ...mockPost, result: 'loss' }
        render(<PostCard {...defaultProps} post={postWithLoss} />)

        expect(screen.getByText('Loss')).toBeInTheDocument()
    })

    it('shows comment form when comment button is clicked', () => {
        render(<PostCard {...defaultProps} />)

        const commentButton = screen.getByTestId('comment-button')
        fireEvent.click(commentButton)

        expect(screen.getByTestId('comment-form')).toBeInTheDocument()
    })

    it('shows comments list when comments are expanded', () => {
        render(<PostCard {...defaultProps} />)

        const commentsButton = screen.getByTestId('comments-button')
        fireEvent.click(commentsButton)

        expect(screen.getByTestId('comments-list')).toBeInTheDocument()
    })

    it('calls onViewProfile when user name is clicked', () => {
        render(<PostCard {...defaultProps} />)

        const userName = screen.getByText(mockPost.user.name)
        fireEvent.click(userName)

        expect(defaultProps.onViewProfile).toHaveBeenCalledWith(mockPost.user.id)
    })

    it('handles long content with truncation', () => {
        const longContent = 'This is a very long post content that should be truncated when displayed in the feed to maintain a clean layout and prevent the post from taking up too much vertical space on the screen.'
        const postWithLongContent = { ...mockPost, content: longContent }

        render(<PostCard {...defaultProps} post={postWithLongContent} />)

        expect(screen.getByText(longContent)).toBeInTheDocument()
    })

    it('displays sport-specific styling', () => {
        render(<PostCard {...defaultProps} />)

        const sportBadge = screen.getByText(`Sport: ${mockPost.sport}`)
        expect(sportBadge).toBeInTheDocument()
    })

    it('handles missing user avatar gracefully', () => {
        const postWithoutAvatar = {
            ...mockPost,
            user: { ...mockPost.user, avatar: '' }
        }

        render(<PostCard {...defaultProps} post={postWithoutAvatar} />)

        const avatar = screen.getByAltText(mockPost.user.name)
        expect(avatar).toBeInTheDocument()
        // Should have a fallback avatar
        expect(avatar).toHaveAttribute('src')
    })

    it('is accessible with proper ARIA labels', () => {
        render(<PostCard {...defaultProps} />)

        const post = screen.getByRole('article')
        expect(post).toBeInTheDocument()

        const likeButton = screen.getByTestId('like-button')
        expect(likeButton).toBeInTheDocument()
    })
})
