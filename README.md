# MERN Stack Testing & Debugging Guide

[![Coverage](https://img.shields.io/badge/coverage-70%25-brightgreen)](https://github.com/your-repo/coverage)
[![Stack](https://img.shields.io/badge/stack-MERN-blue)](https://mern.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A comprehensive testing and debugging strategy for MERN stack applications featuring unit testing, integration testing, end-to-end testing, and advanced debugging techniques.

## 📋 Table of Contents

- [Overview](#-overview)
- [Quick Start](#-quick-start)
- [Testing Strategy](#-testing-strategy)
- [Setup Guide](#️-setup-guide)
- [Testing Examples](#-testing-examples)
- [Debugging Techniques](#-debugging-techniques)
- [Best Practices](#-best-practices)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Overview

This guide provides a complete testing solution for MERN stack applications, ensuring code quality, reliability, and maintainability through a multi-layered testing approach.

### Key Features

- ✅ **Multi-layered Testing**: Unit, Integration, and E2E testing
- 🐛 **Advanced Debugging**: Comprehensive error handling and monitoring
- 📊 **Code Coverage**: 70%+ coverage threshold enforcement
- 🔧 **Developer Experience**: Hot-reload, watch mode, and CI/CD ready
- 🎯 **Performance Focus**: Performance monitoring and optimization

## 🏁 Quick Start

### Prerequisites

- Node.js 16+
- MongoDB 4.4+
- React 18+

### Installation

```bash
# Clone the repository
git clone <your-repo>
cd mern-testing-setup

# Install dependencies
npm install

# Install testing dependencies
npm install -D jest @testing-library/react cypress supertest mongodb-memory-server

# Setup environment
cp .env.example .env
```

### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run specific test types
npm run test:unit
npm run test:integration
npm run test:e2e:headless
```

## 🧪 Testing Strategy

### Testing Pyramid

```
    /\
   /  \    E2E Tests (Cypress)
  /____\   Integration Tests (Supertest)
 /      \  Unit Tests (Jest + RTL)
/________\
```

### Coverage Goals

| Test Type | Coverage Target | Tools |
|-----------|-----------------|-------|
| Unit Tests | 70%+ | Jest, React Testing Library |
| Integration Tests | Critical Paths | Supertest, MongoDB Memory |
| E2E Tests | User Journeys | Cypress |
## ⚙️ Setup Guide

### 1. Jest Configuration

**jest.config.js (Client)**
```javascript
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': 'identity-obj-proxy',
  },
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70
    }
  }
};
```

**jest.config.js (Server)**
```javascript
module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/server/tests/setup.js'],
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/']
};
```

### 2. Package.json Scripts

```json
{
  "scripts": {
    "test": "npm run test:unit && npm run test:integration",
    "test:unit": "jest --config jest.unit.config.js",
    "test:integration": "jest --config jest.integration.config.js",
    "test:e2e": "cypress open",
    "test:e2e:headless": "cypress run",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:ci": "npm run test:coverage && npm run test:e2e:headless"
  }
}
```

### 3. Test Database Setup

```javascript
// server/tests/setup.js
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongoServer.getUri();
});

afterAll(async () => {
  await mongoServer.stop();
});
```

## 📝 Testing Examples

### Unit Testing

**React Components**
```javascript
// UserForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import UserForm from './UserForm';

test('submits form with user data', async () => {
  const mockSubmit = jest.fn();

  render(<UserForm onSubmit={mockSubmit} />);

  fireEvent.change(screen.getByLabelText(/name/i), {
    target: { value: 'John Doe' }
  });

  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      name: 'John Doe'
    });
  });
});
```

**Utility Functions**
```javascript
// utils.test.js
import { formatDate, validateEmail } from './utils';

describe('formatDate', () => {
  it('formats date correctly', () => {
    const date = new Date('2023-01-01');
    expect(formatDate(date)).toBe('January 1, 2023');
  });
});
```

### Integration Testing

**API Endpoints**
```javascript
// userApi.test.js
const request = require('supertest');
const app = require('../app');

describe('POST /api/users', () => {
  it('creates a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({
        name: 'Test User',
        email: 'test@example.com'
      })
      .expect(201);

    expect(response.body).toHaveProperty('id');
    expect(response.body.email).toBe('test@example.com');
  });
});
```

### E2E Testing with Cypress

```javascript
// user_flows.cy.js
describe('User Registration', () => {
  it('registers new user successfully', () => {
    cy.visit('/register');
    cy.get('[data-testid=email]').type('test@example.com');
    cy.get('[data-testid=password]').type('password123');
    cy.get('[data-testid=submit]').click();

    cy.url().should('include', '/dashboard');
    cy.get('[data-testid=welcome-message]').should('be.visible');
  });
});
```

## 🐛 Debugging Techniques

### Error Boundaries in React

```javascript
class ErrorBoundary extends React.Component {
  state = { hasError: false };

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true });
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}
```

### Server Logging

```javascript
// server/middleware/logger.js
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console()
  ]
});

// Request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});
```

### Performance Monitoring

```javascript
// usePerformance.js
export const usePerformance = (componentName) => {
  useEffect(() => {
    const startTime = performance.now();

    return () => {
      const duration = performance.now() - startTime;
      if (duration > 100) {
        console.warn(`Slow component: ${componentName} - ${duration}ms`);
      }
    };
  });
};
```

## 📊 Test Reports

### Coverage Reports

After running `npm run test:coverage`, check the coverage report:

```bash
open coverage/lcov-report/index.html
```

### Cypress Dashboard

```bash
# Run with Cypress Dashboard
npm run test:e2e -- --record --key <your-key>
```

## 🛠️ CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Test Suite
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'

      - run: npm install
      - run: npm run test:ci
      - run: npm run test:e2e:headless

      - name: Upload coverage
        uses: codecov/codecov-action@v3
```

## 📈 Best Practices

### Testing Principles

- **Write Deterministic Tests**: Same input = same output
- **Test Behavior, Not Implementation**: Focus on what, not how
- **Keep Tests Isolated**: No shared state between tests
- **Use Descriptive Test Names**: Should read like documentation
- **Follow AAA Pattern**: Arrange, Act, Assert

### Code Organization

```
src/
├── components/
│   ├── UserForm/
│   │   ├── UserForm.jsx
│   │   ├── UserForm.test.jsx
│   │   └── UserForm.module.css
├── hooks/
│   ├── useAuth.js
│   └── useAuth.test.js
└── utils/
    ├── helpers.js
    └── helpers.test.js
```

### Performance Tips

- Use `jest --watch` for development
- Run unit tests in parallel
- Use Cypress component testing for complex components
- Mock external services in integration tests

## 🚨 Troubleshooting

### Common Issues

**Issue: MongoDB Memory Server timeout**
```bash
# Increase timeout
jest --testTimeout=30000
```

**Issue: CSS imports in tests**
```javascript
// jest.config.js
moduleNameMapper: {
  '\\.(css|less|scss)$': 'identity-obj-proxy'
}
```

**Issue: Window undefined in tests**
```javascript
// setupTests.js
global.matchMedia = global.matchMedia || function() {
  return {
    matches: false,
    addListener: jest.fn(),
    removeListener: jest.fn(),
  };
};
```

### Debugging Tests

```bash
# Debug Jest tests
node --inspect-brk node_modules/.bin/jest --runInBand

# Debug Cypress tests
npm run test:e2e -- --headed --no-exit
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Cypress Documentation](https://docs.cypress.io/)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any problems:

- Check the [Troubleshooting](#-troubleshooting) section
- Search existing issues
- Create a new issue with detailed information

---

**Happy Testing! 🎯**

*Remember: Good tests don't just find bugs, they prevent them.*