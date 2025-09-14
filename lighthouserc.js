module.exports = {
    ci: {
        collect: {
            url: ['http://localhost:3000', 'http://localhost:3000/profile', 'http://localhost:3000/chat'],
            startServerCommand: 'npm run dev',
            startServerReadyPattern: 'Ready',
            startServerReadyTimeout: 120000,
            numberOfRuns: 3,
        },
        assert: {
            assertions: {
                'categories:performance': ['error', { minScore: 0.8 }],
                'categories:accessibility': ['error', { minScore: 0.9 }],
                'categories:best-practices': ['error', { minScore: 0.8 }],
                'categories:seo': ['error', { minScore: 0.8 }],
                'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
                'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
                'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
                'total-blocking-time': ['error', { maxNumericValue: 300 }],
                'speed-index': ['error', { maxNumericValue: 3000 }],
            },
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
