import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('/')
    })

    test('should display the main heading', async ({ page }) => {
        await expect(page.getByRole('heading', { name: 'Tipster Arena' })).toBeVisible()
    })

    test('should display the tagline', async ({ page }) => {
        await expect(page.getByText(/The ultimate platform for sports tipsters/)).toBeVisible()
    })

    test('should show all feature cards', async ({ page }) => {
        const features = [
            'Share Your Tips',
            'Live Sports Chat',
            'Transparent Tracking',
            'Find Top Tipsters',
            'Community Driven',
            'Sports Only'
        ]

        for (const feature of features) {
            await expect(page.getByText(feature)).toBeVisible()
        }
    })

    test('should navigate to auth modal when Get Started is clicked', async ({ page }) => {
        await page.getByRole('button', { name: 'Get Started' }).click()

        // Check if auth modal or signup form is displayed
        await expect(page.locator('[data-testid="auth-modal"], [data-testid="signup-form"]')).toBeVisible()
    })

    test('should open login modal when Sign In is clicked', async ({ page }) => {
        await page.getByRole('button', { name: 'Sign In' }).click()

        // Check if auth modal or login form is displayed
        await expect(page.locator('[data-testid="auth-modal"], [data-testid="login-form"]')).toBeVisible()
    })

    test('should display feature descriptions', async ({ page }) => {
        await expect(page.getByText(/Post your sports predictions and tips/)).toBeVisible()
        await expect(page.getByText(/Join dedicated chat rooms for each sport/)).toBeVisible()
        await expect(page.getByText(/Automatic win\/loss tracking/)).toBeVisible()
    })

    test('should show navigation menu', async ({ page }) => {
        await expect(page.getByText('Features')).toBeVisible()
        await expect(page.getByText('How It Works')).toBeVisible()
        await expect(page.getByText('Community')).toBeVisible()
    })

    test('should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })

        // Check if mobile navigation is visible
        await expect(page.locator('[data-testid="mobile-menu"], .mobile-nav')).toBeVisible()
    })

    test('should have proper accessibility attributes', async ({ page }) => {
        // Check for proper heading structure
        const mainHeading = page.getByRole('heading', { level: 1 })
        await expect(mainHeading).toBeVisible()

        // Check for alt text on images
        const images = page.locator('img')
        const imageCount = await images.count()

        for (let i = 0; i < imageCount; i++) {
            const img = images.nth(i)
            const alt = await img.getAttribute('alt')
            expect(alt).toBeTruthy()
        }
    })

    test('should handle keyboard navigation', async ({ page }) => {
        // Test tab navigation
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')

        // Check if focus is visible
        const focusedElement = page.locator(':focus')
        await expect(focusedElement).toBeVisible()
    })

    test('should display statistics section', async ({ page }) => {
        // Look for statistics or numbers
        const statsSection = page.locator('[data-testid="stats-section"], .stats, .statistics')
        await expect(statsSection).toBeVisible()
    })

    test('should show footer information', async ({ page }) => {
        await expect(page.getByText(/© 2024 Tipster Arena/)).toBeVisible()
    })

    test('should load quickly', async ({ page }) => {
        const startTime = Date.now()
        await page.goto('/')
        await page.waitForLoadState('networkidle')
        const loadTime = Date.now() - startTime

        // Page should load within 3 seconds
        expect(loadTime).toBeLessThan(3000)
    })

    test('should handle feature card interactions', async ({ page }) => {
        const featureCards = page.locator('[data-testid="feature-card"], .feature-card')
        const cardCount = await featureCards.count()

        if (cardCount > 0) {
            await featureCards.first().click()
            // Verify some interaction occurred (e.g., modal, scroll, etc.)
        }
    })

    test('should display proper meta information', async ({ page }) => {
        // Check page title
        await expect(page).toHaveTitle(/Tipster Arena/)

        // Check meta description
        const metaDescription = page.locator('meta[name="description"]')
        await expect(metaDescription).toHaveAttribute('content', /sports tipsters/)
    })

    test('should handle scroll interactions', async ({ page }) => {
        // Test smooth scrolling to sections
        await page.getByText('Features').click()

        // Wait for scroll animation
        await page.waitForTimeout(500)

        // Verify we're in the features section
        const featuresSection = page.locator('[data-testid="features-section"], #features, .features')
        await expect(featuresSection).toBeInViewport()
    })

    test('should display call-to-action section', async ({ page }) => {
        await expect(page.getByText(/Ready to start sharing your tips?/)).toBeVisible()
    })

    test('should handle different screen sizes', async ({ page }) => {
        const viewports = [
            { width: 1920, height: 1080 }, // Desktop
            { width: 1024, height: 768 },  // Tablet
            { width: 375, height: 667 },   // Mobile
        ]

        for (const viewport of viewports) {
            await page.setViewportSize(viewport)

            // Verify main elements are still visible
            await expect(page.getByRole('heading', { name: 'Tipster Arena' })).toBeVisible()
            await expect(page.getByText(/The ultimate platform for sports tipsters/)).toBeVisible()
        }
    })

    test('should handle external links properly', async ({ page }) => {
        // Check if external links open in new tabs
        const externalLinks = page.locator('a[href^="http"]:not([href*="localhost"])')
        const linkCount = await externalLinks.count()

        if (linkCount > 0) {
            const firstLink = externalLinks.first()
            const target = await firstLink.getAttribute('target')
            expect(target).toBe('_blank')
        }
    })
})
