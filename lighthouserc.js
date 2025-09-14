module.exports = {
    ci: {
        collect: {
            url: ['http://localhost:3000', 'http://localhost:3000/profile', 'http://localhost:3000/chat'],
            startServerCommand: 'npm run start',
            startServerReadyPattern: 'Ready',
            startServerReadyTimeout: 120000,
            numberOfRuns: 3,
        },
        assert: {
            assertions: {
                'categories:performance': ['warn', { minScore: 0.6 }],
                'categories:accessibility': ['warn', { minScore: 0.8 }],
                'categories:best-practices': ['warn', { minScore: 0.7 }],
                'categories:seo': ['warn', { minScore: 0.7 }],
                'first-contentful-paint': ['warn', { maxNumericValue: 3000 }],
                'largest-contentful-paint': ['warn', { maxNumericValue: 4000 }],
                'cumulative-layout-shift': ['warn', { maxNumericValue: 0.2 }],
                'total-blocking-time': ['warn', { maxNumericValue: 1000 }],
                'speed-index': ['warn', { maxNumericValue: 5000 }],
            },
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
