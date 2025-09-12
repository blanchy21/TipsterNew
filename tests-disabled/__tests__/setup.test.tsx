import React from 'react'
import { render, screen } from '@testing-library/react'

// Simple test component
const TestComponent = () => {
    return <div data-testid="test-component">Test Component</div>
}

describe('Test Setup', () => {
    it('should render a simple component', () => {
        render(<TestComponent />)
        expect(screen.getByTestId('test-component')).toBeInTheDocument()
        expect(screen.getByText('Test Component')).toBeInTheDocument()
    })

    it('should have proper test environment', () => {
        expect(typeof window).toBe('object')
        expect(typeof document).toBe('object')
        expect(typeof navigator).toBe('object')
    })

    it('should have Jest matchers available', () => {
        expect(true).toBe(true)
        expect('hello').toContain('hello')
        expect([1, 2, 3]).toHaveLength(3)
    })

    it('should have testing library available', () => {
        expect(render).toBeDefined()
        expect(screen).toBeDefined()
        expect(screen.getByTestId).toBeDefined()
    })
})
