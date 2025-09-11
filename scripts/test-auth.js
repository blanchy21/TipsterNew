#!/usr/bin/env node

const puppeteer = require('puppeteer')
const fs = require('fs')
const path = require('path')

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const OUTPUT_DIR = path.join(__dirname, '..', 'auth-test-reports')

if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function testAuthenticationFlow() {
    console.log('🔐 Starting Authentication Flow Tests...')
    console.log(`📍 Base URL: ${BASE_URL}`)

    const browser = await puppeteer.launch({
        headless: false, // Set to true for CI/CD
        devtools: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    try {
        const page = await browser.newPage()

        // Set viewport
        await page.setViewport({ width: 1280, height: 720 })

        // Test 1: Homepage loads correctly
        console.log('\n📄 Test 1: Homepage loads correctly')
        await page.goto(BASE_URL, { waitUntil: 'networkidle0' })

        const title = await page.title()
        console.log(`✅ Page title: ${title}`)

        // Take screenshot
        await page.screenshot({
            path: path.join(OUTPUT_DIR, '01-homepage.png'),
            fullPage: true
        })

        // Test 2: Check for authentication elements
        console.log('\n🔍 Test 2: Check for authentication elements')

        // Look for sign-in related elements
        const signInElements = await page.$$eval('button, a', elements =>
            elements
                .filter(el => el.textContent && (
                    el.textContent.toLowerCase().includes('sign in') ||
                    el.textContent.toLowerCase().includes('login') ||
                    el.textContent.toLowerCase().includes('sign up') ||
                    el.textContent.toLowerCase().includes('register')
                ))
                .map(el => ({
                    text: el.textContent.trim(),
                    tagName: el.tagName,
                    visible: el.offsetParent !== null
                }))
        )

        console.log('📋 Found authentication elements:', signInElements)

        // Test 3: Try to open authentication modal
        console.log('\n🚪 Test 3: Open authentication modal')

        const signInButton = await page.$('button:has-text("Sign In"), button:has-text("Sign Up")')

        if (signInButton) {
            await signInButton.click()
            await page.waitForTimeout(1000) // Wait for modal to open

            // Take screenshot of modal
            await page.screenshot({
                path: path.join(OUTPUT_DIR, '02-auth-modal.png'),
                fullPage: true
            })

            // Check for modal content
            const modalContent = await page.$$eval('[role="dialog"], .modal, [data-testid*="modal"]', elements =>
                elements.map(el => ({
                    visible: el.offsetParent !== null,
                    text: el.textContent.trim().substring(0, 200)
                }))
            )

            console.log('📋 Modal content found:', modalContent)

            // Check for Google sign-in button
            const googleButton = await page.$('button:has-text("Google"), button:has-text("Sign in with Google")')
            if (googleButton) {
                const googleButtonText = await googleButton.evaluate(el => el.textContent)
                console.log(`✅ Google sign-in button found: "${googleButtonText}"`)
            } else {
                console.log('⚠️  Google sign-in button not found')
            }

            // Check for email/password form
            const emailInput = await page.$('input[type="email"], input[placeholder*="email" i]')
            const passwordInput = await page.$('input[type="password"]')

            if (emailInput && passwordInput) {
                console.log('✅ Email/password form found')

                // Test form validation
                console.log('\n📝 Test 4: Form validation')

                // Try to submit empty form
                const submitButton = await page.$('button[type="submit"], button:has-text("Sign In")')
                if (submitButton) {
                    await submitButton.click()
                    await page.waitForTimeout(500)

                    // Check for validation errors
                    const errors = await page.$$eval('text=required, text=invalid, text=error', elements =>
                        elements.filter(el => el.offsetParent !== null).map(el => el.textContent.trim())
                    )

                    if (errors.length > 0) {
                        console.log('✅ Form validation working:', errors)
                    } else {
                        console.log('⚠️  No validation errors detected')
                    }
                }
            } else {
                console.log('⚠️  Email/password form not found')
            }

            // Close modal
            const closeButton = await page.$('button[aria-label="Close"], button:has-text("×"), button:has-text("Close")')
            if (closeButton) {
                await closeButton.click()
                await page.waitForTimeout(500)
            } else {
                // Try clicking outside modal
                await page.click('body', { position: { x: 10, y: 10 } })
                await page.waitForTimeout(500)
            }
        } else {
            console.log('⚠️  No sign-in button found')
        }

        // Test 4: Test protected routes
        console.log('\n🔒 Test 4: Test protected routes')

        const protectedRoutes = ['/profile', '/chat', '/following']

        for (const route of protectedRoutes) {
            console.log(`\n📍 Testing route: ${route}`)
            await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0' })

            // Take screenshot
            const filename = `03-${route.replace('/', '')}.png`
            await page.screenshot({
                path: path.join(OUTPUT_DIR, filename),
                fullPage: true
            })

            // Check if redirected or shows auth required message
            const currentUrl = page.url()
            const pageContent = await page.textContent('body')

            if (currentUrl.includes('/') && route !== '/') {
                console.log(`⚠️  Redirected from ${route} to ${currentUrl}`)
            } else if (pageContent.includes('Sign In') || pageContent.includes('Please sign in')) {
                console.log(`✅ Auth required message shown for ${route}`)
            } else {
                console.log(`✅ Route ${route} accessible (user might be authenticated)`)
            }
        }

        // Test 5: Check console for errors
        console.log('\n🚨 Test 5: Check for console errors')

        const consoleErrors = []
        page.on('console', msg => {
            if (msg.type() === 'error') {
                consoleErrors.push(msg.text())
            }
        })

        await page.goto(BASE_URL, { waitUntil: 'networkidle0' })
        await page.waitForTimeout(2000)

        if (consoleErrors.length > 0) {
            console.log('❌ Console errors found:', consoleErrors)
        } else {
            console.log('✅ No console errors detected')
        }

        // Generate test report
        const testResults = {
            timestamp: new Date().toISOString(),
            baseUrl: BASE_URL,
            tests: {
                homepageLoad: true,
                authElements: signInElements,
                consoleErrors: consoleErrors,
                protectedRoutes: protectedRoutes.map(route => ({
                    route,
                    accessible: !consoleErrors.some(error => error.includes(route))
                }))
            }
        }

        const reportPath = path.join(OUTPUT_DIR, 'auth-test-report.json')
        fs.writeFileSync(reportPath, JSON.stringify(testResults, null, 2))
        console.log(`\n📊 Test report saved to: ${reportPath}`)

        console.log('\n🎉 Authentication flow tests completed!')
        console.log(`📁 Screenshots saved in: ${OUTPUT_DIR}`)

    } catch (error) {
        console.error('❌ Test failed:', error.message)

        // Take error screenshot
        try {
            await page.screenshot({
                path: path.join(OUTPUT_DIR, 'error-screenshot.png'),
                fullPage: true
            })
        } catch (screenshotError) {
            console.error('Failed to take error screenshot:', screenshotError.message)
        }

        throw error
    } finally {
        await browser.close()
    }
}

// Run the test
testAuthenticationFlow().catch(error => {
    console.error('Authentication test suite failed:', error)
    process.exit(1)
})
