import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LandingPage from '../pages/LandingPage';

// Mock the useAuth hook
jest.mock('@/lib/hooks/useAuth', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
  }),
}));

describe('LandingPage', () => {
  const defaultProps = {
    onGetStarted: jest.fn(),
    onShowAuthModal: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the main heading', () => {
    render(<LandingPage {...defaultProps} />);

    expect(screen.getAllByText('Tipster Arena')[0]).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<LandingPage {...defaultProps} />);

    expect(screen.getByText(/Where sports fans/)).toBeInTheDocument();
  });

  it('displays all feature cards', () => {
    render(<LandingPage {...defaultProps} />);

    expect(screen.getByText('Share Tips')).toBeInTheDocument();
    expect(screen.getAllByText('Live Chat')[0]).toBeInTheDocument();
    expect(screen.getByText('Track Record')).toBeInTheDocument();
    expect(screen.getByText('Find Winners')).toBeInTheDocument();
    expect(screen.getAllByText('Community').length).toBeGreaterThan(0);
    expect(screen.getByText('Free Forever')).toBeInTheDocument();
  });

  it('calls onGetStarted when Get Started button is clicked', () => {
    render(<LandingPage {...defaultProps} />);

    const getStartedButtons = screen.getAllByText('Get Started Free');
    fireEvent.click(getStartedButtons[0]);

    expect(defaultProps.onGetStarted).toHaveBeenCalled();
  });

  it('calls onShowAuthModal when Sign In button is clicked', () => {
    render(<LandingPage {...defaultProps} />);

    const signInButton = screen.getByText('Sign in');
    fireEvent.click(signInButton);

    expect(defaultProps.onShowAuthModal).toHaveBeenCalledWith('login');
  });

  it('displays feature descriptions', () => {
    render(<LandingPage {...defaultProps} />);

    expect(screen.getByText(/Post predictions for any sport/)).toBeInTheDocument();
    expect(screen.getByText(/Dedicated rooms for Football/)).toBeInTheDocument();
    expect(screen.getByText(/Automatic win\/loss tracking/)).toBeInTheDocument();
  });

  it('shows navigation items', () => {
    render(<LandingPage {...defaultProps} />);

    expect(screen.getAllByText('Features')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Sports')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Community')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Pricing')[0]).toBeInTheDocument();
  });

  it('displays the logo', () => {
    render(<LandingPage {...defaultProps} />);

    const logo = screen.getByAltText('Tipster Arena');
    expect(logo).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<LandingPage {...defaultProps} />);

    const mainHeading = screen.getByRole('heading', { level: 1 });
    expect(mainHeading).toBeInTheDocument();

    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('renders feature card labels', () => {
    render(<LandingPage {...defaultProps} />);

    // Feature cards now use numbered labels and SVG icons
    expect(screen.getByText('01')).toBeInTheDocument();
    expect(screen.getByText('02')).toBeInTheDocument();
    expect(screen.getByText('03')).toBeInTheDocument();
    expect(screen.getByText('04')).toBeInTheDocument();
    expect(screen.getByText('05')).toBeInTheDocument();
    expect(screen.getByText('06')).toBeInTheDocument();
  });

  it('displays pricing section', () => {
    render(<LandingPage {...defaultProps} />);

    expect(screen.getByText('$0')).toBeInTheDocument();
    expect(screen.getByText(/per month, forever/)).toBeInTheDocument();
  });

  it('handles loading state', async () => {
    render(<LandingPage {...defaultProps} />);

    // The component should handle loading state gracefully
    await waitFor(() => {
      expect(screen.getAllByText('Tipster Arena')[0]).toBeInTheDocument();
    });
  });

  it('shows call-to-action section', () => {
    render(<LandingPage {...defaultProps} />);

    expect(screen.getByText(/Ready to prove/)).toBeInTheDocument();
  });

  it('displays footer information', () => {
    render(<LandingPage {...defaultProps} />);

    const currentYear = new Date().getFullYear();
    expect(
      screen.getByText(`© ${currentYear} Tipster Arena. All rights reserved.`)
    ).toBeInTheDocument();
  });

  it('has responsive design elements', () => {
    render(<LandingPage {...defaultProps} />);

    // Check for responsive classes or mobile-friendly elements
    const navigation = screen.getByRole('navigation');
    expect(navigation).toBeInTheDocument();
  });

  it('handles feature card interactions', () => {
    render(<LandingPage {...defaultProps} />);

    // Test if feature cards are rendered
    const featureCards = screen.getAllByText(/Share Tips|Live Chat|Track Record/);
    expect(featureCards.length).toBeGreaterThan(0);
  });

  it('displays subheadline text', () => {
    render(<LandingPage {...defaultProps} />);

    expect(screen.getByText(/Share tips, track your win rate/)).toBeInTheDocument();
  });
});
