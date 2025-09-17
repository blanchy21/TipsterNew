import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AuthProvider } from '@/lib/contexts/AuthContext'
import { useAuth } from '@/lib/hooks/useAuth'

// Mock Firebase auth
const mockUser = {
    uid: 'test-user-id',
    email: 'test@example.com',
    displayName: 'Test User',
    photoURL: 'https://example.com/avatar.jpg',
}

const mockSignInWithPopup = jest.fn(() => Promise.resolve({
    user: {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
    }
}))
const mockCreateUserWithEmailAndPassword = jest.fn(() => Promise.resolve({
    user: {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
    }
}))
const mockSignInWithEmailAndPassword = jest.fn(() => Promise.resolve({
    user: {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
    }
}))
const mockSignOut = jest.fn(() => Promise.resolve())
const mockOnAuthStateChanged = jest.fn()

jest.mock('firebase/auth', () => ({
    signInWithPopup: jest.fn(() => mockSignInWithPopup()),
    GoogleAuthProvider: jest.fn(),
    signOut: jest.fn(() => mockSignOut()),
    createUserWithEmailAndPassword: jest.fn(() => mockCreateUserWithEmailAndPassword()),
    signInWithEmailAndPassword: jest.fn(() => mockSignInWithEmailAndPassword()),
    sendPasswordResetEmail: jest.fn(),
    updateProfile: jest.fn(() => Promise.resolve()),
}))

jest.mock('@/lib/firebase/firebase', () => ({
    auth: {
        onAuthStateChanged: jest.fn((callback) => mockOnAuthStateChanged(callback)),
    },
}))

jest.mock('@/lib/firebase/firebaseUtils', () => ({
    createUserProfile: jest.fn(),
}))

// Test component that uses auth
function TestAuthComponent() {
    const { user, loading, signInWithGoogle, signInWithEmail, signUpWithEmail, signOut } = useAuth()

    if (loading) {
        return <div data-testid="loading">Loading...</div>
    }

    if (user) {
        return (
            <div>
                <div data-testid="user-info">
                    <span data-testid="user-email">{user.email}</span>
                    <span data-testid="user-name">{user.displayName}</span>
                </div>
                <button data-testid="sign-out" onClick={signOut}>
                    Sign Out
                </button>
            </div>
        )
    }

    return (
        <div>
            <div data-testid="not-signed-in">Not signed in</div>
            <button data-testid="sign-in-google" onClick={signInWithGoogle}>
                Sign in with Google
            </button>
            <button
                data-testid="sign-in-email"
                onClick={() => signInWithEmail('test@example.com', 'password')}
            >
                Sign in with Email
            </button>
            <button
                data-testid="sign-up-email"
                onClick={() => signUpWithEmail('test@example.com', 'password', 'Test User')}
            >
                Sign up with Email
            </button>
        </div>
    )
}

function AuthTestWrapper({ children }: { children: React.ReactNode }) {
    return <AuthProvider>{children}</AuthProvider>
}

describe('Authentication Flow', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        mockOnAuthStateChanged.mockImplementation((callback) => {
            // Simulate no user initially
            callback(null)
            return jest.fn() // unsubscribe function
        })
    })

    it('should show loading state initially', () => {
        // Mock to not call callback immediately to show loading state
        mockOnAuthStateChanged.mockImplementation((callback) => {
            // Don't call callback immediately to simulate loading state
            return jest.fn() // unsubscribe function
        })

        render(
            <AuthTestWrapper>
                <TestAuthComponent />
            </AuthTestWrapper>
        )

        expect(screen.getByTestId('loading')).toBeInTheDocument()
    })

    it('should show sign-in options when no user is authenticated', async () => {
        render(
            <AuthTestWrapper>
                <TestAuthComponent />
            </AuthTestWrapper>
        )

        await waitFor(() => {
            expect(screen.getByTestId('not-signed-in')).toBeInTheDocument()
            expect(screen.getByTestId('sign-in-google')).toBeInTheDocument()
            expect(screen.getByTestId('sign-in-email')).toBeInTheDocument()
            expect(screen.getByTestId('sign-up-email')).toBeInTheDocument()
        })
    })

    it('should show user info when authenticated', async () => {
        // Mock authenticated user
        mockOnAuthStateChanged.mockImplementation((callback) => {
            callback(mockUser)
            return jest.fn()
        })

        render(
            <AuthTestWrapper>
                <TestAuthComponent />
            </AuthTestWrapper>
        )

        await waitFor(() => {
            expect(screen.getByTestId('user-info')).toBeInTheDocument()
            expect(screen.getByTestId('user-email')).toHaveTextContent('test@example.com')
            expect(screen.getByTestId('user-name')).toHaveTextContent('Test User')
            expect(screen.getByTestId('sign-out')).toBeInTheDocument()
        })
    })

    it('should call signInWithGoogle when Google sign-in button is clicked', async () => {
        render(
            <AuthTestWrapper>
                <TestAuthComponent />
            </AuthTestWrapper>
        )

        await waitFor(() => {
            expect(screen.getByTestId('sign-in-google')).toBeInTheDocument()
        })

        fireEvent.click(screen.getByTestId('sign-in-google'))

        expect(mockSignInWithPopup).toHaveBeenCalled()
    })

    it('should call signInWithEmail when email sign-in button is clicked', async () => {
        render(
            <AuthTestWrapper>
                <TestAuthComponent />
            </AuthTestWrapper>
        )

        await waitFor(() => {
            expect(screen.getByTestId('sign-in-email')).toBeInTheDocument()
        })

        fireEvent.click(screen.getByTestId('sign-in-email'))

        expect(mockSignInWithEmailAndPassword).toHaveBeenCalled()
    })

    it('should call signUpWithEmail when email sign-up button is clicked', async () => {
        render(
            <AuthTestWrapper>
                <TestAuthComponent />
            </AuthTestWrapper>
        )

        await waitFor(() => {
            expect(screen.getByTestId('sign-up-email')).toBeInTheDocument()
        })

        fireEvent.click(screen.getByTestId('sign-up-email'))

        expect(mockCreateUserWithEmailAndPassword).toHaveBeenCalled()
    })

    it('should call signOut when sign-out button is clicked', async () => {
        // Mock authenticated user
        mockOnAuthStateChanged.mockImplementation((callback) => {
            callback(mockUser)
            return jest.fn()
        })

        render(
            <AuthTestWrapper>
                <TestAuthComponent />
            </AuthTestWrapper>
        )

        await waitFor(() => {
            expect(screen.getByTestId('sign-out')).toBeInTheDocument()
        })

        fireEvent.click(screen.getByTestId('sign-out'))

        expect(mockSignOut).toHaveBeenCalled()
    })
})
