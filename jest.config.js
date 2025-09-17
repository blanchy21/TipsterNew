const nextJest = require('next/jest')

const createJestConfig = nextJest({
    // Provide the path to your Next.js app to load next.config.js and .env files
    dir: './',
})

// Add any custom config to be passed to Jest
const customJestConfig = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    testEnvironment: 'jsdom',
    testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/', '<rootDir>/e2e/'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/*.stories.{js,jsx,ts,tsx}',
        '!src/**/index.{js,jsx,ts,tsx}',
        '!src/app/**/*', // Exclude all app directory files
        '!src/middleware.ts', // Exclude middleware
        '!src/lib/firebase/**/*', // Exclude Firebase config
        '!src/types/**/*', // Exclude type definitions
        '!src/lib/authErrors.ts', // Exclude auth error handling
        '!src/lib/testData.ts', // Exclude test data
        '!src/lib/serviceWorker.ts', // Exclude service worker
        '!src/components/App.tsx', // Exclude main App component
        '!src/components/admin/**/*', // Exclude admin components
        '!src/components/features/**/*', // Exclude feature components
        '!src/components/forms/**/*', // Exclude form components
        '!src/components/layout/**/*', // Exclude layout components
        '!src/components/pages/**/*', // Exclude page components
        '!src/components/ui/**/*', // Exclude UI components
        '!src/lib/contexts/**/*', // Exclude context files
        '!src/lib/hooks/**/*', // Exclude hooks
        '!src/lib/providers/**/*', // Exclude providers
    ],
    coverageThreshold: {
        global: {
            branches: 1,
            functions: 1,
            lines: 1,
            statements: 1,
        },
    },
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}',
        '<rootDir>/src/**/*.{test,spec}.{js,jsx,ts,tsx}',
    ],
    moduleDirectories: ['node_modules', '<rootDir>/'],
    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    },
    transformIgnorePatterns: [
        '/node_modules/',
        '^.+\\.module\\.(css|sass|scss)$',
    ],
}

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig)