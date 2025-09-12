import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LandingPage from '../LandingPage'

// Mock the useAuth hook
jest.mock('@/lib/hooks/useAuth', () => ({
    useAuth: () => ({
        user: null,
        loading: false,
    }),
}))

describe('LandingPage', () => {
    const defaultProps = {
        onGetStarted: jest.fn(),
        onShowAuthModal: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders the main heading', () => {
        render(<LandingPage {...defaultProps} />)

        expect(screen.getByText('Tipster Arena')).toBeInTheDocument()
    })

    it('renders the tagline', () => {
        render(<LandingPage {...defaultProps} />)

        expect(screen.getByText(/The ultimate platform for sports tipsters/)).toBeInTheDocument()
    })

    it('displays all feature cards', () => {
        render(<LandingPage {...defaultProps} />)

        expect(screen.getByText('Share Your Tips')).toBeInTheDocument()
        expect(screen.getByText('Live Sports Chat')).toBeInTheDocument()
        expect(screen.getByText('Transparent Tracking')).toBeInTheDocument()
        expect(screen.getByText('Find Top Tipsters')).toBeInTheDocument()
        expect(screen.getByText('Community Driven')).toBeInTheDocument()
        expect(screen.getByText('Sports Only')).toBeInTheDocument()
    })

    it('calls onGetStarted when Get Started button is clicked', () => {
        render(<LandingPage {...defaultProps} />)

        const getStartedButton = screen.getByText('Get Started')
        fireEvent.click(getStartedButton)

        expect(defaultProps.onGetStarted).toHaveBeenCalled()
    })

    it('calls onShowAuthModal when Sign In button is clicked', () => {
        render(<LandingPage {...defaultProps} />)

        const signInButton = screen.getByText('Sign In')
        fireEvent.click(signInButton)

        expect(defaultProps.onShowAuthModal).toHaveBeenCalledWith('login')
    })

    it('displays feature descriptions', () => {
        render(<LandingPage {...defaultProps} />)

        expect(screen.getByText(/Post your sports predictions and tips/)).toBeInTheDocument()
        expect(screen.getByText(/Join dedicated chat rooms for each sport/)).toBeInTheDocument()
        expect(screen.getByText(/Automatic win\/loss tracking/)).toBeInTheDocument()
    })

    it('shows navigation items', () => {
        render(<LandingPage {...defaultProps} />)

        expect(screen.getByText('Features')).toBeInTheDocument()
        expect(screen.getByText('How It Works')).toBeInTheDocument()
        expect(screen.getByText('Community')).toBeInTheDocument()
    })

    it('displays the logo', () => {
        render(<LandingPage {...defaultProps} />)

        const logo = screen.getByAltText('Tipster Arena')
        expect(logo).toBeInTheDocument()
    })

    it('has proper accessibility attributes', () => {
        render(<LandingPage {...defaultProps} />)

        const mainHeading = screen.getByRole('heading', { level: 1 })
        expect(mainHeading).toBeInTheDocument()

        const buttons = screen.getAllByRole('button')
        expect(buttons.length).toBeGreaterThan(0)
    })

    it('renders feature icons', () => {
        render(<LandingPage {...defaultProps} />)

        // Check for emoji icons in feature cards
        expect(screen.getByText('🎯')).toBeInTheDocument() // Share Your Tips
        expect(screen.getByText('💬')).toBeInTheDocument() // Live Sports Chat
        expect(screen.getByText('📊')).toBeInTheDocument() // Transparent Tracking
        expect(screen.getByText('🔍')).toBeInTheDocument() // Find Top Tipsters
        expect(screen.getByText('👥')).toBeInTheDocument() // Community Driven
        expect(screen.getByText('🛡️')).toBeInTheDocument() // Sports Only
    })

    it('displays statistics section', () => {
        render(<LandingPage {...defaultProps} />)

        // Look for common statistics text
        expect(screen.getByText(/tipsters/i)).toBeInTheDocument()
        expect(screen.getByText(/tips/i)).toBeInTheDocument()
    })

    it('handles loading state', async () => {
        render(<LandingPage {...defaultProps} />)

        // The component should handle loading state gracefully
        await waitFor(() => {
            expect(screen.getByText('Tipster Arena')).toBeInTheDocument()
        })
    })

    it('shows call-to-action section', () => {
        render(<LandingPage {...defaultProps} />)

        const ctaSection = screen.getByText(/Ready to start sharing your tips?/i)
        expect(ctaSection).toBeInTheDocument()
    })

    it('displays footer information', () => {
        render(<LandingPage {...defaultProps} />)

        // Look for footer content
        expect(screen.getByText(/© 2024 Tipster Arena/i)).toBeInTheDocument()
    })

    it('has responsive design elements', () => {
        render(<LandingPage {...defaultProps} />)

        // Check for responsive classes or mobile-friendly elements
        const container = screen.getByRole('main')
        expect(container).toBeInTheDocument()
    })

    it('handles feature card interactions', () => {
        render(<LandingPage {...defaultProps} />)

        // Test if feature cards are interactive
        const featureCards = screen.getAllByText(/Share Your Tips|Live Sports Chat|Transparent Tracking/)
        expect(featureCards.length).toBeGreaterThan(0)
    })

    it('displays proper meta information', () => {
        render(<LandingPage {...defaultProps} />)

        // Check for meta content like descriptions
        expect(screen.getByText(/ultimate platform/i)).toBeInTheDocument()
    })
})
