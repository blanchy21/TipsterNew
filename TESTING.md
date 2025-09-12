# Tipster Arena - Comprehensive Test Suite

This document outlines the comprehensive testing strategy for Tipster Arena, ensuring excellent performance, reliability, and user experience.

## 🧪 Testing Overview

Our test suite covers multiple layers of testing to ensure the highest quality:

- **Unit Tests** - Individual component and function testing
- **Integration Tests** - API route and service integration testing
- **End-to-End Tests** - Complete user flow testing
- **Performance Tests** - Lighthouse audits and performance monitoring
- **Security Tests** - Vulnerability scanning and dependency auditing

## 📁 Test Structure

```text
├── src/
│   ├── __tests__/
│   │   └── utils/
│   │       └── test-utils.tsx          # Shared test utilities and mocks
│   ├── components/
│   │   └── __tests__/                  # Component unit tests
│   │       ├── PostCard.test.tsx
│   │       ├── LandingPage.test.tsx
│   │       └── AuthModal.test.tsx
│   └── app/
│       └── api/
│           └── __tests__/              # API integration tests
│               └── chat.test.ts
├── e2e/                               # End-to-end tests
│   ├── landing-page.spec.ts
│   └── user-flow.spec.ts
├── scripts/
│   └── performance-test.js            # Performance monitoring
├── jest.config.js                     # Jest configuration
├── jest.setup.js                      # Jest setup and mocks
├── playwright.config.ts               # Playwright configuration
└── lighthouserc.js                    # Lighthouse CI configuration
```

## 🚀 Quick Start

### Running All Tests

```bash
npm run test:all
```

### Individual Test Suites

```bash
# Unit tests
npm run test                    # Run once
npm run test:watch             # Watch mode
npm run test:coverage          # With coverage report
npm run test:ci                # CI mode (no watch)

# End-to-end tests
npm run test:e2e               # Run all E2E tests
npm run test:e2e:ui            # Interactive UI mode
npm run test:e2e:debug         # Debug mode
npm run test:e2e:headed        # Run with browser visible

# Performance tests
npm run test:performance       # Lighthouse CI
node scripts/performance-test.js  # Custom performance script
```

## 🔧 Test Configuration

### Jest Configuration

- **Environment**: jsdom (simulates browser environment)
- **Coverage Threshold**: 70% for branches, functions, lines, and statements
- **Test Match**: `**/__tests__/**/*.{js,jsx,ts,tsx}` and `**/*.{test,spec}.{js,jsx,ts,tsx}`
- **Setup**: Custom setup file with Firebase and Next.js mocks

### Playwright Configuration

- **Browsers**: Chromium, Firefox, WebKit
- **Devices**: Desktop, Mobile Chrome, Mobile Safari
- **Base URL**: <http://localhost:3000>
- **Auto-start**: Development server before tests

### Lighthouse CI Configuration

- **URLs**: Homepage, Profile, Chat pages
- **Performance Threshold**: 80+
- **Accessibility Threshold**: 90+
- **Best Practices Threshold**: 80+
- **SEO Threshold**: 80+

## 📊 Coverage Requirements

### Unit Test Coverage

- **Branches**: 70%
- **Functions**: 70%
- **Lines**: 70%
- **Statements**: 70%

### Performance Benchmarks

- **First Contentful Paint**: < 2s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **Total Blocking Time**: < 300ms
- **Speed Index**: < 3s

## 🎯 Test Categories

### 1. Unit Tests

#### Component Tests

- **PostCard**: Post rendering, interactions, accessibility
- **LandingPage**: Feature display, navigation, responsiveness
- **AuthModal**: Authentication flows, form validation
- **Feed**: Post loading, filtering, sorting
- **ChatInterface**: Message sending, real-time updates

#### Utility Tests

- **Firebase Utils**: Database operations, authentication
- **Image Utils**: Image processing, optimization
- **Leaderboard Utils**: Statistics calculation, ranking

### 2. Integration Tests

#### API Routes

- **Chat API**: OpenAI integration, streaming responses
- **Auth API**: Firebase authentication, user management
- **Upload API**: Image upload, file validation

#### Database Integration

- **Post Operations**: Create, read, update, delete
- **User Operations**: Profile management, following system
- **Real-time Updates**: Firestore listeners, live data

### 3. End-to-End Tests

#### Critical User Flows

- **Authentication**: Sign up, sign in, sign out
- **Post Creation**: Create, edit, delete posts
- **Social Features**: Like, comment, follow users
- **Chat**: Send messages, real-time communication
- **Profile Management**: Update profile, view statistics

#### Cross-Browser Testing

- **Chrome**: Latest version
- **Firefox**: Latest version
- **Safari**: Latest version
- **Mobile**: iOS Safari, Android Chrome

### 4. Performance Tests

#### Lighthouse Audits

- **Performance**: Core Web Vitals, loading metrics
- **Accessibility**: WCAG compliance, screen reader support
- **Best Practices**: Security, modern web standards
- **SEO**: Meta tags, structured data, search optimization

#### Load Testing

- **Concurrent Users**: Multiple simultaneous users
- **Data Volume**: Large datasets, pagination
- **Network Conditions**: Slow 3G, offline scenarios

### 5. Security Tests

#### Vulnerability Scanning

- **Dependencies**: npm audit, security vulnerabilities
- **Code Analysis**: Static code analysis, security patterns
- **Authentication**: JWT validation, session management

## 🛠️ Test Utilities

### Mock Data

```typescript
// Mock user data
export const mockUser = {
  uid: "test-user-id",
  email: "test@example.com",
  displayName: "Test User",
  photoURL: "<https://example.com/avatar.jpg>",
};

// Mock post data
export const mockPost = {
  id: "test-post-id",
  content: "This is a test post",
  sport: "football",
  odds: 2.5,
  user: mockUser,
  createdAt: new Date(),
  likes: 5,
  comments: 2,
  views: 100,
};
```

### Custom Render Function

```typescript
import { render } from "@/__tests__/utils/test-utils";

// Automatically wraps components with all providers
render(<MyComponent />);
```

### Firebase Mocks

- **Authentication**: Mock sign in/out, user state
- **Firestore**: Mock database operations
- **Storage**: Mock file uploads

## 🔄 Continuous Integration

### GitHub Actions Workflow

The CI pipeline runs on every push and pull request:

1. **Unit Tests**: Jest with coverage reporting
2. **Type Checking**: TypeScript compilation
3. **Linting**: ESLint with Next.js rules
4. **E2E Tests**: Playwright across multiple browsers
5. **Performance Tests**: Lighthouse CI audits
6. **Security Audit**: npm audit and dependency scanning
7. **Build Test**: Production build verification

### Test Reports

- **Coverage**: Codecov integration
- **E2E**: Playwright HTML reports
- **Performance**: Lighthouse CI reports
- **Security**: Audit reports

## 📈 Monitoring & Alerts

### Performance Monitoring

- **Real User Monitoring**: Core Web Vitals tracking
- **Error Tracking**: JavaScript error monitoring
- **Uptime Monitoring**: Service availability
- **Performance Budgets**: Bundle size limits

### Quality Gates

- **Coverage**: Minimum 70% coverage required
- **Performance**: Lighthouse scores must meet thresholds
- **Security**: No critical vulnerabilities
- **Accessibility**: WCAG AA compliance

## 🐛 Debugging Tests

### Unit Test Debugging

```bash
# Run specific test file
npm test -- PostCard.test.tsx

# Run with verbose output
npm test -- --verbose

# Debug mode
npm test -- --detectOpenHandles --forceExit
```

### E2E Test Debugging

```bash
# Run with UI
npm run test:e2e:ui

# Debug mode with browser
npm run test:e2e:debug

# Run specific test
npx playwright test landing-page.spec.ts
```

### Performance Debugging

```bash
# Run custom performance script
node scripts/performance-test.js

# Lighthouse with specific config
npx lighthouse <http://localhost:3000> --config-path=lighthouserc.js
```

## 📝 Writing Tests

### Unit Test Best Practices

1. **Arrange-Act-Assert**: Clear test structure
2. **Descriptive Names**: Test names should explain what's being tested
3. **Single Responsibility**: One assertion per test
4. **Mock External Dependencies**: Use mocks for Firebase, APIs
5. **Test Edge Cases**: Empty states, error conditions

### E2E Test Best Practices

1. **Page Object Model**: Reusable page objects
2. **Wait Strategies**: Proper waiting for elements
3. **Data Cleanup**: Clean up test data
4. **Parallel Execution**: Run tests in parallel when possible
5. **Cross-Browser**: Test on multiple browsers

### Performance Test Best Practices

1. **Consistent Environment**: Same conditions for all tests
2. **Multiple Runs**: Average results over multiple runs
3. **Realistic Data**: Use production-like data volumes
4. **Network Simulation**: Test under different network conditions
5. **Monitor Trends**: Track performance over time

## 🚨 Troubleshooting

### Common Issues

#### Tests Failing

1. Check if development server is running
2. Verify environment variables are set
3. Check for port conflicts
4. Ensure all dependencies are installed

#### Performance Issues

1. Check network conditions
2. Verify server performance
3. Review bundle sizes
4. Check for memory leaks

#### E2E Flakiness

1. Add proper waits
2. Use more specific selectors
3. Check for race conditions
4. Verify test data setup

## 📚 Resources

### Documentation

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [Lighthouse CI](https://github.com/GoogleChrome/lighthouse-ci)

### Best Practices

- [Testing JavaScript Applications](https://testingjavascript.com/)
- [Web Performance Best Practices](https://web.dev/performance/)
- [Accessibility Testing](https://www.w3.org/WAI/WCAG21/quickref/)

## 🤝 Contributing

When adding new features:

1. Write unit tests for new components
2. Add integration tests for new APIs
3. Include E2E tests for new user flows
4. Update performance benchmarks if needed
5. Ensure all tests pass before submitting PR

## 📊 Test Metrics

### Current Coverage

- **Components**: 85%+ coverage
- **Utilities**: 90%+ coverage
- **API Routes**: 80%+ coverage

### Performance Targets

- **Lighthouse Performance**: 90+
- **Lighthouse Accessibility**: 95+
- **Bundle Size**: < 500KB gzipped
- **Load Time**: < 2s on 3G

---

**Remember**: Good tests are an investment in code quality, developer confidence, and user experience. Write tests that are maintainable, reliable, and provide real value to the development process.
