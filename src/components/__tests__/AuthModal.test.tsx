import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import AuthModal from '../AuthModal'

// Mock the SignInWithGoogle component
jest.mock('../forms/SignInWithGoogle', () => {
    return function MockSignInWithGoogle({ onSuccess }: any) {
        return (
            <button
                data-testid="google-signin"
                onClick={() => onSuccess && onSuccess()}
            >
                Sign in with Google
            </button>
        )
    }
})

// Mock the LoginForm component
jest.mock('../LoginForm', () => {
    return function MockLoginForm({ onSuccess, onSwitchToSignup }: any) {
        return (
            <div data-testid="login-form">
                <button onClick={() => onSwitchToSignup && onSwitchToSignup()}>
                    Switch to Signup
                </button>
                <button onClick={() => onSuccess && onSuccess()}>
                    Login
                </button>
            </div>
        )
    }
})

// Mock the SignupForm component
jest.mock('../SignupForm', () => {
    return function MockSignupForm({ onSuccess, onSwitchToLogin }: any) {
        return (
            <div data-testid="signup-form">
                <button onClick={() => onSwitchToLogin && onSwitchToLogin()}>
                    Switch to Login
                </button>
                <button onClick={() => onSuccess && onSuccess()}>
                    Signup
                </button>
            </div>
        )
    }
})

describe('AuthModal', () => {
    const defaultProps = {
        isOpen: true,
        initialMode: 'login' as const,
        onClose: jest.fn(),
        onSuccess: jest.fn(),
        onSwitchMode: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders login form when initialMode is login', () => {
        render(<AuthModal {...defaultProps} />)

        expect(screen.getByTestId('login-form')).toBeInTheDocument()
        expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument()
    })

    it('renders signup form when initialMode is signup', () => {
        render(<AuthModal {...defaultProps} initialMode="signup" />)

        expect(screen.getByTestId('signup-form')).toBeInTheDocument()
        expect(screen.queryByTestId('login-form')).not.toBeInTheDocument()
    })

    it('does not render when isOpen is false', () => {
        render(<AuthModal {...defaultProps} isOpen={false} />)

        expect(screen.queryByTestId('login-form')).not.toBeInTheDocument()
        expect(screen.queryByTestId('signup-form')).not.toBeInTheDocument()
    })

    it('calls onClose when close button is clicked', () => {
        render(<AuthModal {...defaultProps} />)

        const closeButton = screen.getByRole('button', { name: /close/i })
        fireEvent.click(closeButton)

        expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('calls onClose when backdrop is clicked', () => {
        render(<AuthModal {...defaultProps} />)

        const backdrop = screen.getByTestId('modal-backdrop')
        fireEvent.click(backdrop)

        expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('does not close when modal content is clicked', () => {
        render(<AuthModal {...defaultProps} />)

        const modalContent = screen.getByTestId('modal-content')
        fireEvent.click(modalContent)

        expect(defaultProps.onClose).not.toHaveBeenCalled()
    })

    it('calls onSwitchMode when switching from login to signup', () => {
        render(<AuthModal {...defaultProps} initialMode="login" />)

        const switchButton = screen.getByText('Switch to Signup')
        fireEvent.click(switchButton)

        expect(defaultProps.onSwitchMode).toHaveBeenCalledWith('signup')
    })

    it('calls onSwitchMode when switching from signup to login', () => {
        render(<AuthModal {...defaultProps} initialMode="signup" />)

        const switchButton = screen.getByText('Switch to Login')
        fireEvent.click(switchButton)

        expect(defaultProps.onSwitchMode).toHaveBeenCalledWith('login')
    })

    it('calls onSuccess when login is successful', () => {
        render(<AuthModal {...defaultProps} initialMode="login" />)

        const loginButton = screen.getByText('Login')
        fireEvent.click(loginButton)

        expect(defaultProps.onSuccess).toHaveBeenCalled()
    })

    it('calls onSuccess when signup is successful', () => {
        render(<AuthModal {...defaultProps} initialMode="signup" />)

        const signupButton = screen.getByText('Signup')
        fireEvent.click(signupButton)

        expect(defaultProps.onSuccess).toHaveBeenCalled()
    })

    it('renders Google sign-in option', () => {
        render(<AuthModal {...defaultProps} />)

        expect(screen.getByTestId('google-signin')).toBeInTheDocument()
    })

    it('calls onSuccess when Google sign-in is successful', () => {
        render(<AuthModal {...defaultProps} />)

        const googleSignIn = screen.getByTestId('google-signin')
        fireEvent.click(googleSignIn)

        expect(defaultProps.onSuccess).toHaveBeenCalled()
    })

    it('has proper accessibility attributes', () => {
        render(<AuthModal {...defaultProps} />)

        const modal = screen.getByRole('dialog')
        expect(modal).toBeInTheDocument()

        const closeButton = screen.getByRole('button', { name: /close/i })
        expect(closeButton).toBeInTheDocument()
    })

    it('handles keyboard navigation', () => {
        render(<AuthModal {...defaultProps} />)

        // Test Escape key
        fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' })
        expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('displays correct title based on initialMode', () => {
        const { rerender } = render(<AuthModal {...defaultProps} initialMode="login" />)

        expect(screen.getByText(/sign in/i)).toBeInTheDocument()

        rerender(<AuthModal {...defaultProps} initialMode="signup" />)

        expect(screen.getByText(/create account/i)).toBeInTheDocument()
    })

    it('handles loading state', async () => {
        render(<AuthModal {...defaultProps} />)

        // Modal should render without loading issues
        await waitFor(() => {
            expect(screen.getByTestId('login-form')).toBeInTheDocument()
        })
    })

    it('prevents body scroll when modal is open', () => {
        render(<AuthModal {...defaultProps} />)

        // Check if body has overflow hidden (common pattern for modals)
        expect(document.body).toHaveStyle('overflow: hidden')
    })

    it('restores body scroll when modal is closed', () => {
        const { rerender } = render(<AuthModal {...defaultProps} />)

        rerender(<AuthModal {...defaultProps} isOpen={false} />)

        // Body scroll should be restored
        expect(document.body).not.toHaveStyle('overflow: hidden')
    })

    it('focuses on modal when opened', async () => {
        render(<AuthModal {...defaultProps} />)

        await waitFor(() => {
            const modal = screen.getByRole('dialog')
            expect(modal).toHaveFocus()
        })
    })
})
