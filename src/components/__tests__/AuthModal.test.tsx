import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import AuthModal from '../modals/AuthModal'

// Mock the LoginForm component
jest.mock('../forms/LoginForm', () => {
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
jest.mock('../forms/SignupForm', () => {
    return function MockSignupForm({ onSuccess, onSwitchToLogin }: any) {
        return (
            <div data-testid="signup-form">
                <button onClick={() => onSwitchToLogin && onSwitchToLogin()}>
                    Switch to Login
                </button>
                <button onClick={() => onSuccess && onSuccess()}>
                    Sign up
                </button>
            </div>
        )
    }
})

// Mock useAuth hook
jest.mock('@/lib/hooks/useAuth', () => ({
    useAuth: () => ({
        loading: false,
        user: null,
    }),
}))

describe('AuthModal', () => {
    const defaultProps = {
        isOpen: true,
        initialMode: 'login' as const,
        onClose: jest.fn(),
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

        expect(screen.queryByTestId('auth-modal')).not.toBeInTheDocument()
    })

    it('calls onClose when close button is clicked', () => {
        render(<AuthModal {...defaultProps} />)

        const buttons = screen.getAllByRole('button')
        const closeButton = buttons[0] // The close button is the first one
        fireEvent.click(closeButton)

        expect(defaultProps.onClose).toHaveBeenCalled()
    })

    it('switches between login and signup modes', () => {
        render(<AuthModal {...defaultProps} initialMode="login" />)

        expect(screen.getByTestId('login-form')).toBeInTheDocument()

        const switchButton = screen.getByText('Switch to Signup')
        fireEvent.click(switchButton)

        expect(screen.getByTestId('signup-form')).toBeInTheDocument()
        expect(screen.queryByTestId('login-form')).not.toBeInTheDocument()
    })

    it('prevents body scroll when modal is open', () => {
        render(<AuthModal {...defaultProps} />)

        // Check if body has overflow hidden (common pattern for modals)
        expect(document.body).toHaveStyle('overflow: hidden')
    })

    it('restores body scroll when modal is closed', () => {
        const { rerender } = render(<AuthModal {...defaultProps} />)

        expect(document.body).toHaveStyle('overflow: hidden')

        rerender(<AuthModal {...defaultProps} isOpen={false} />)

        expect(document.body).toHaveStyle('overflow: unset')
    })
})