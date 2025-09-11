import { test, expect } from '@playwright/test'

test.describe('User Authentication Flow', () => {
    test('should complete signup flow', async ({ page }) => {
        await page.goto('/')

        // Click Get Started
        await page.getByRole('button', { name: 'Get Started' }).click()

        // Wait for auth modal or redirect
        await page.waitForSelector('[data-testid="auth-modal"], [data-testid="signup-form"], form')

        // Fill signup form if present
        const emailInput = page.locator('input[type="email"], input[name="email"]')
        const passwordInput = page.locator('input[type="password"], input[name="password"]')
        const nameInput = page.locator('input[name="name"], input[name="displayName"]')

        if (await emailInput.isVisible()) {
            await emailInput.fill('test@example.com')
        }
        if (await passwordInput.isVisible()) {
            await passwordInput.fill('password123')
        }
        if (await nameInput.isVisible()) {
            await nameInput.fill('Test User')
        }

        // Click signup button
        const signupButton = page.getByRole('button', { name: /sign up|create account|register/i })
        if (await signupButton.isVisible()) {
            await signupButton.click()

            // Wait for success or error
            await page.waitForTimeout(1000)
        }
    })

    test('should complete login flow', async ({ page }) => {
        await page.goto('/')

        // Click Sign In
        await page.getByRole('button', { name: 'Sign In' }).click()

        // Wait for auth modal
        await page.waitForSelector('[data-testid="auth-modal"], [data-testid="login-form"], form')

        // Fill login form if present
        const emailInput = page.locator('input[type="email"], input[name="email"]')
        const passwordInput = page.locator('input[type="password"], input[name="password"]')

        if (await emailInput.isVisible()) {
            await emailInput.fill('test@example.com')
        }
        if (await passwordInput.isVisible()) {
            await passwordInput.fill('password123')
        }

        // Click login button
        const loginButton = page.getByRole('button', { name: /sign in|login|log in/i })
        if (await loginButton.isVisible()) {
            await loginButton.click()

            // Wait for redirect or success
            await page.waitForTimeout(1000)
        }
    })

    test('should handle Google sign-in', async ({ page }) => {
        await page.goto('/')

        // Click Sign In
        await page.getByRole('button', { name: 'Sign In' }).click()

        // Wait for auth modal
        await page.waitForSelector('[data-testid="auth-modal"], [data-testid="google-signin"], button')

        // Click Google sign-in if present
        const googleButton = page.getByRole('button', { name: /sign in with google|continue with google/i })
        if (await googleButton.isVisible()) {
            await googleButton.click()

            // Wait for popup or redirect
            await page.waitForTimeout(1000)
        }
    })
})

test.describe('Post Creation Flow', () => {
    test('should create a new post', async ({ page }) => {
        // Navigate to main app (assuming user is logged in or in demo mode)
        await page.goto('/')

        // Wait for app to load
        await page.waitForSelector('[data-testid="post-button"], button[aria-label*="post"], .create-post')

        // Click create post button
        const postButton = page.locator('[data-testid="post-button"], button[aria-label*="post"], .create-post').first()
        await postButton.click()

        // Wait for post modal or form
        await page.waitForSelector('[data-testid="post-modal"], [data-testid="post-form"], textarea, input[type="text"]')

        // Fill post form
        const contentInput = page.locator('textarea, input[type="text"][placeholder*="tip"], input[type="text"][placeholder*="post"]')
        if (await contentInput.isVisible()) {
            await contentInput.fill('Test tip: Team A to win at odds 2.5')
        }

        // Select sport if dropdown is present
        const sportSelect = page.locator('select[name="sport"], [data-testid="sport-select"]')
        if (await sportSelect.isVisible()) {
            await sportSelect.selectOption('football')
        }

        // Enter odds if field is present
        const oddsInput = page.locator('input[name="odds"], input[type="number"]')
        if (await oddsInput.isVisible()) {
            await oddsInput.fill('2.5')
        }

        // Submit post
        const submitButton = page.getByRole('button', { name: /post|submit|publish/i })
        if (await submitButton.isVisible()) {
            await submitButton.click()

            // Wait for success
            await page.waitForTimeout(1000)

            // Verify post appears in feed
            await expect(page.getByText('Test tip: Team A to win at odds 2.5')).toBeVisible()
        }
    })
})

test.describe('Navigation Flow', () => {
    test('should navigate between main sections', async ({ page }) => {
        await page.goto('/')

        // Test navigation to different sections
        const navItems = ['Feed', 'Chat', 'Profile', 'Following']

        for (const navItem of navItems) {
            const navLink = page.getByRole('link', { name: navItem }).or(page.getByText(navItem))
            if (await navLink.isVisible()) {
                await navLink.click()

                // Wait for navigation
                await page.waitForTimeout(500)

                // Verify we're on the correct page
                await expect(page.url()).toContain(navItem.toLowerCase())
            }
        }
    })

    test('should handle mobile navigation', async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 })
        await page.goto('/')

        // Look for mobile menu button
        const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"], .mobile-menu-toggle, button[aria-label*="menu"]')
        if (await mobileMenuButton.isVisible()) {
            await mobileMenuButton.click()

            // Verify mobile menu opens
            await expect(page.locator('[data-testid="mobile-menu"], .mobile-nav')).toBeVisible()

            // Test navigation items in mobile menu
            const mobileNavItems = page.locator('[data-testid="mobile-menu"] a, .mobile-nav a')
            const itemCount = await mobileNavItems.count()

            if (itemCount > 0) {
                await mobileNavItems.first().click()
                await page.waitForTimeout(500)
            }
        }
    })
})

test.describe('Feed Interaction Flow', () => {
    test('should interact with posts in feed', async ({ page }) => {
        await page.goto('/')

        // Wait for feed to load
        await page.waitForSelector('[data-testid="feed"], .feed, [data-testid="post-card"]')

        // Find first post
        const firstPost = page.locator('[data-testid="post-card"], .post-card').first()
        if (await firstPost.isVisible()) {
            // Test like button
            const likeButton = firstPost.locator('[data-testid="like-button"], button[aria-label*="like"], .like-button')
            if (await likeButton.isVisible()) {
                await likeButton.click()
                await page.waitForTimeout(500)
            }

            // Test comment button
            const commentButton = firstPost.locator('[data-testid="comment-button"], button[aria-label*="comment"], .comment-button')
            if (await commentButton.isVisible()) {
                await commentButton.click()

                // Wait for comment form
                await page.waitForSelector('[data-testid="comment-form"], textarea[placeholder*="comment"]')

                // Add comment if form is present
                const commentInput = page.locator('[data-testid="comment-form"] textarea, textarea[placeholder*="comment"]')
                if (await commentInput.isVisible()) {
                    await commentInput.fill('Great tip!')

                    const submitComment = page.getByRole('button', { name: /comment|reply/i })
                    if (await submitComment.isVisible()) {
                        await submitComment.click()
                        await page.waitForTimeout(500)
                    }
                }
            }

            // Test view profile
            const profileLink = firstPost.locator('[data-testid="profile-link"], a[href*="profile"]')
            if (await profileLink.isVisible()) {
                await profileLink.click()
                await page.waitForTimeout(500)

                // Verify we're on profile page
                await expect(page.url()).toContain('profile')

                // Go back to feed
                await page.goBack()
            }
        }
    })
})

test.describe('Chat Flow', () => {
    test('should navigate to chat and send message', async ({ page }) => {
        await page.goto('/')

        // Navigate to chat
        const chatLink = page.getByRole('link', { name: /chat/i }).or(page.getByText(/chat/i))
        if (await chatLink.isVisible()) {
            await chatLink.click()

            // Wait for chat to load
            await page.waitForSelector('[data-testid="chat-interface"], .chat, textarea[placeholder*="message"]')

            // Send a message
            const messageInput = page.locator('[data-testid="message-input"], textarea[placeholder*="message"], input[placeholder*="message"]')
            if (await messageInput.isVisible()) {
                await messageInput.fill('Hello everyone!')

                const sendButton = page.getByRole('button', { name: /send/i })
                if (await sendButton.isVisible()) {
                    await sendButton.click()

                    // Wait for message to appear
                    await page.waitForTimeout(1000)

                    // Verify message appears
                    await expect(page.getByText('Hello everyone!')).toBeVisible()
                }
            }
        }
    })
})

test.describe('Performance Tests', () => {
    test('should load pages quickly', async ({ page }) => {
        const pages = ['/', '/profile', '/chat']

        for (const pageUrl of pages) {
            const startTime = Date.now()
            await page.goto(pageUrl)
            await page.waitForLoadState('networkidle')
            const loadTime = Date.now() - startTime

            // Each page should load within 3 seconds
            expect(loadTime).toBeLessThan(3000)
        }
    })

    test('should handle large data sets', async ({ page }) => {
        await page.goto('/')

        // Wait for feed to load
        await page.waitForSelector('[data-testid="feed"], .feed')

        // Scroll to load more posts
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
        await page.waitForTimeout(1000)

        // Verify feed still works
        const feed = page.locator('[data-testid="feed"], .feed')
        await expect(feed).toBeVisible()
    })
})
