#!/usr/bin/env node

const { default: lighthouse } = require('lighthouse')
const chromeLauncher = require('chrome-launcher')
const fs = require('fs')
const path = require('path')

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000'
const OUTPUT_DIR = path.join(__dirname, '..', 'performance-reports')

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true })
}

const pages = [
    { name: 'homepage', url: '/' },
    { name: 'chat', url: '/chat' },
]

async function runLighthouse(url, name) {
    console.log(`🔍 Running Lighthouse audit for ${name}...`)

    const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })

    const options = {
        logLevel: 'error', // Reduce noise
        output: 'json',
        onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
        port: chrome.port,
        settings: {
            maxWaitForFcp: 10000,
            maxWaitForLoad: 30000,
            throttling: {
                rttMs: 40,
                throughputKbps: 10240,
                cpuSlowdownMultiplier: 1,
            },
        },
    }

    try {
        const runnerResult = await lighthouse(`${BASE_URL}${url}`, options)

        if (!runnerResult || !runnerResult.lhr) {
            throw new Error('No results returned from Lighthouse')
        }

        const results = runnerResult.lhr

        console.log(`✅ ${name} audit completed:`)

        // Safely get scores
        const performance = results.categories?.performance?.score ? Math.round(results.categories.performance.score * 100) : 0
        const accessibility = results.categories?.accessibility?.score ? Math.round(results.categories.accessibility.score * 100) : 0
        const bestPractices = results.categories?.['best-practices']?.score ? Math.round(results.categories['best-practices'].score * 100) : 0
        const seo = results.categories?.seo?.score ? Math.round(results.categories.seo.score * 100) : 0

        console.log(`   Performance: ${performance}`)
        console.log(`   Accessibility: ${accessibility}`)
        console.log(`   Best Practices: ${bestPractices}`)
        console.log(`   SEO: ${seo}`)

        // Safely get metrics
        const fcp = results.audits?.['first-contentful-paint']?.numericValue || 0
        const lcp = results.audits?.['largest-contentful-paint']?.numericValue || 0
        const cls = results.audits?.['cumulative-layout-shift']?.numericValue || 0

        console.log(`   FCP: ${fcp > 0 ? Math.round(fcp) : 'N/A'}ms`)
        console.log(`   LCP: ${lcp > 0 ? Math.round(lcp) : 'N/A'}ms`)
        console.log(`   CLS: ${cls.toFixed(3)}`)

        // Save report
        const reportPath = path.join(OUTPUT_DIR, `${name}-report.json`)
        fs.writeFileSync(reportPath, JSON.stringify(results, null, 2))

        return {
            page: name,
            url,
            performance,
            accessibility,
            bestPractices,
            seo,
            fcp,
            lcp,
            cls,
            passed: performance >= 50 && accessibility >= 70 // Basic thresholds
        }

    } catch (error) {
        console.log(`❌ Error auditing ${name}: ${error.message}`)
        return {
            page: name,
            url,
            error: error.message,
            passed: false
        }
    } finally {
        await chrome.kill()
    }
}

async function runPerformanceTests() {
    console.log('🚀 Starting performance tests...')
    console.log(`📍 Base URL: ${BASE_URL}`)

    const results = []

    for (const page of pages) {
        const result = await runLighthouse(page.url, page.name)
        results.push(result)

        // Small delay between tests
        await new Promise(resolve => setTimeout(resolve, 1000))
    }

    // Save summary
    const summary = {
        timestamp: new Date().toISOString(),
        baseUrl: BASE_URL,
        results: results,
        summary: {
            total: results.length,
            passed: results.filter(r => r.passed).length,
            failed: results.filter(r => !r.passed).length
        }
    }

    const summaryPath = path.join(OUTPUT_DIR, 'performance-summary.json')
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))

    console.log(`📊 Performance test summary saved to: ${summaryPath}`)

    const passedCount = results.filter(r => r.passed).length
    const totalCount = results.length

    if (passedCount === totalCount) {
        console.log('🎉 All performance tests passed!')
        process.exit(0)
    } else {
        console.log(`💥 ${totalCount - passedCount} performance tests failed!`)
        process.exit(1)
    }
}

// Run the tests
runPerformanceTests().catch(error => {
    console.error('💥 Performance test suite failed:', error.message)
    process.exit(1)
})