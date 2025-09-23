module.exports = {
    ci: {
        collect: {
            url: ['http://localhost:3000', 'http://localhost:3000/profile', 'http://localhost:3000/chat'],
            startServerCommand: 'npm run start',
            startServerReadyPattern: 'Local:',
            startServerReadyTimeout: 120000,
            numberOfRuns: 3,
        },
        assert: {
            assertions: {
                // Basic performance assertions - relaxed thresholds for CI
                'categories:performance': ['warn', { minScore: 0.3 }],
                'categories:accessibility': ['warn', { minScore: 0.7 }],
                'categories:best-practices': ['warn', { minScore: 0.6 }],
                'categories:seo': ['warn', { minScore: 0.6 }],
                // Relaxed Core Web Vitals thresholds for CI environment
                'first-contentful-paint': ['warn', { maxNumericValue: 5000 }],
                'largest-contentful-paint': ['warn', { maxNumericValue: 6000 }],
                'cumulative-layout-shift': ['warn', { maxNumericValue: 0.3 }],
                'total-blocking-time': ['warn', { maxNumericValue: 2000 }],
                'speed-index': ['warn', { maxNumericValue: 8000 }],
            },
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
