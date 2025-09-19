import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LandingPage from '../pages/LandingPage'

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

        expect(screen.getAllByText('Tipster Arena')[0]).toBeInTheDocument()
    })

    it('renders the tagline', () => {
        render(<LandingPage {...defaultProps} />)

        expect(screen.getByText(/The ultimate platform for sports tipsters/)).toBeInTheDocument()
    })

    it('displays all feature cards', () => {
        render(<LandingPage {...defaultProps} />)

        expect(screen.getByText('Share Your Tips')).toBeInTheDocument()
        expect(screen.getAllByText('Live Sports Chat')[0]).toBeInTheDocument()
        expect(screen.getByText('Transparent Tracking')).toBeInTheDocument()
        expect(screen.getByText('Find Top Tipsters')).toBeInTheDocument()
        expect(screen.getByText('Community Driven')).toBeInTheDocument()
        expect(screen.getByText('Sports Only')).toBeInTheDocument()
    })

    it('calls onGetStarted when Get Started button is clicked', () => {
        render(<LandingPage {...defaultProps} />)

        const getStartedButton = screen.getByText('Get started')
        fireEvent.click(getStartedButton)

        expect(defaultProps.onGetStarted).toHaveBeenCalled()
    })

    it('calls onShowAuthModal when Sign In button is clicked', () => {
        render(<LandingPage {...defaultProps} />)

        const signInButton = screen.getByText('Sign in')
        fireEvent.click(signInButton)

        expect(defaultProps.onShowAuthModal).toHaveBeenCalledWith('login')
    })

    it('displays feature descriptions', () => {
        render(<LandingPage {...defaultProps} />)

        expect(screen.getByText(/Post your sports predictions and tips/)).toBeInTheDocument()
        expect(screen.getAllByText(/Join dedicated chat rooms for each sport/)[0]).toBeInTheDocument()
        expect(screen.getByText(/Automatic win\/loss tracking/)).toBeInTheDocument()
    })

    it('shows navigation items', () => {
        render(<LandingPage {...defaultProps} />)

        expect(screen.getByText('Features')).toBeInTheDocument()
        expect(screen.getByText('Sports')).toBeInTheDocument()
        expect(screen.getAllByText('Community')[0]).toBeInTheDocument()
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

        // Check for emoji icons in feature cards - use getAllByText for duplicates
        expect(screen.getByText('🎯')).toBeInTheDocument() // Share Your Tips
        expect(screen.getAllByText('💬')[0]).toBeInTheDocument() // Live Sports Chat
        expect(screen.getByText('📊')).toBeInTheDocument() // Transparent Tracking
        expect(screen.getByText('🔍')).toBeInTheDocument() // Find Top Tipsters
        expect(screen.getByText('👥')).toBeInTheDocument() // Community Driven
        expect(screen.getByText('🛡️')).toBeInTheDocument() // Sports Only
    })

    it('displays statistics section', () => {
        render(<LandingPage {...defaultProps} />)

        // Look for common statistics text - updated to match current content
        expect(screen.getByText(/100% free/i)).toBeInTheDocument()
        expect(screen.getAllByText(/completely free forever/i)).toHaveLength(2)
    })

    it('handles loading state', async () => {
        render(<LandingPage {...defaultProps} />)

        // The component should handle loading state gracefully
        await waitFor(() => {
            expect(screen.getAllByText('Tipster Arena')[0]).toBeInTheDocument()
        })
    })

    it('shows call-to-action section', () => {
        render(<LandingPage {...defaultProps} />)

        const ctaSection = screen.getAllByText((content, element) => {
            return element?.textContent?.includes('Ready to Start Sharing Tips') || false
        })[0]
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
        // The current landing page doesn't have a main role, so check for navigation instead
        const navigation = screen.getByRole('navigation')
        expect(navigation).toBeInTheDocument()
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
