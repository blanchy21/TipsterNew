import { test, expect } from '@playwright/test'

test.describe('Landing Page', () => {
    test.beforeEach(async ({ page, context }) => {
        // Clear storage to ensure we see the landing page
        await context.clearCookies();
        await context.clearPermissions();
        await page.goto('/')
    })

    test('should display the main heading', async ({ page }) => {
        await expect(page.getByRole('heading', { name: /Where sports fans prove their expertise/ })).toBeVisible()
    })

    test('should display the tagline', async ({ page }) => {
        await expect(page.getByText(/Share tips, track your win rate, and build a real reputation/)).toBeVisible()
    })

    test('should show all feature cards', async ({ page }) => {
        // Feature cards cycle, so check they exist in the DOM (not necessarily visible)
        await expect(page.getByText('Share Tips')).toBeAttached()
        await expect(page.getByText('Live Chat')).toBeAttached()
        await expect(page.getByText('Track Record')).toBeAttached()
        await expect(page.getByText('Find Winners')).toBeAttached()
        await expect(page.getByText('Community')).toBeAttached()
        await expect(page.getByText('Free Forever')).toBeAttached()
    })

    test('should navigate to auth when Get Started is clicked', async ({ page }) => {
        const getStartedButton = page.getByRole('link', { name: /Get Started Free/ }).first()
        await expect(getStartedButton).toBeVisible()
        await getStartedButton.click()
        await expect(page.locator('h1')).toBeVisible()
    })

    test('should display feature descriptions', async ({ page }) => {
        await expect(page.getByText(/Post predictions for any sport/)).toBeAttached()
        await expect(page.getByText(/Dedicated rooms for Football, Racing, Golf/)).toBeAttached()
        await expect(page.getByText(/Automatic win\/loss tracking/)).toBeAttached()
    })

    test('should show navigation menu', async ({ page }) => {
        // Check for navigation links specifically
        await expect(page.locator('nav a:has-text("Features")')).toBeVisible()
        await expect(page.locator('nav a:has-text("Sports")')).toBeVisible()
        await expect(page.locator('nav a:has-text("Community")')).toBeVisible()
        // Pricing is a button, not a link
        await expect(page.locator('nav button:has-text("Pricing")')).toBeVisible()
    })

    test('should be responsive on mobile', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })

        // Verify the page still renders on mobile
        await expect(page.locator('h1')).toBeVisible()
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

        // Just verify we can tab through elements without errors
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
        await page.keyboard.press('Tab')
    })

    test('should display pricing section', async ({ page }) => {
        await expect(page.getByText(/Free\. Forever\./)).toBeVisible()
        await expect(page.getByText(/\$0/)).toBeVisible()
    })

    test('should show footer information', async ({ page }) => {
        await expect(page.getByText(/© \d{4} Tipster Arena/)).toBeVisible()
    })

    test('should load quickly', async ({ page }) => {
        const startTime = Date.now()
        await page.goto('/')
        // Wait for the main content to be visible instead of networkidle
        await page.waitForSelector('h1', { timeout: 10000 })
        const loadTime = Date.now() - startTime

        // Page should load within 10 seconds (more realistic for CI)
        expect(loadTime).toBeLessThan(10000)
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
        await expect(metaDescription).toHaveAttribute('content', /sports/)
    })

    test('should handle scroll interactions', async ({ page }) => {
        // Test smooth scrolling to sections
        await page.locator('nav a:has-text("Features")').click()

        // Wait for scroll animation
        await page.waitForTimeout(500)

        // Verify we're in the features section
        const featuresSection = page.locator('[data-testid="features-section"], #features, .features')
        await expect(featuresSection).toBeInViewport()
    })

    test('should display call-to-action section', async ({ page }) => {
        await expect(page.getByText(/Ready to prove your edge/)).toBeVisible()
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
            await expect(page.locator('h1')).toBeVisible()
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
