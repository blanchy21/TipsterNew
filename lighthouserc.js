module.exports = {
  ci: {
    collect: {
      url: ['http://localhost:3000', 'http://localhost:3000/profile', 'http://localhost:3000/chat'],
      startServerCommand: 'npm run start',
      startServerReadyPattern: 'started server on',
      startServerReadyTimeout: 120000,
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', { minScore: 0.1 }],
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
