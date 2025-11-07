# Bug Tracker - MERN Stack Application

[![Coverage](https://img.shields.io/badge/coverage-70%25-brightgreen)](https://github.com/your-repo/coverage)
[![Stack](https://img.shields.io/badge/stack-MERN-blue)](https://mern.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

A comprehensive bug tracking application built with the MERN stack, featuring testing, debugging, and advanced development practices.

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

A bug tracking application built with MongoDB, Express.js, React, and Node.js, featuring comprehensive testing strategies and debugging techniques.

### Key Features

- ✅ **Bug Management**: Create, update, delete, and track bugs efficiently
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
git clone https://github.com/PLP-MERN-Stack-Development/testing-and-debugging-ensuring-mern-app-reliability-TJ-dot-1.git
cd testing-and-debugging-ensuring-mern-app-reliability-TJ-dot-1

# Install server dependencies
cd server && npm install

# Install client dependencies
cd ../client && npm install

# Setup environment (create .env file in server directory)
cd ../server
cp .env.example .env
# Edit .env to add your MongoDB URI
```

### Run the Application

```bash
# Start the server (from server directory)
cd server && npm run dev

# In another terminal, start the client (from client directory)
cd client && npm start
```

### Run Tests

```bash
# Run server tests
cd server && npm test

# Run client tests
cd client && npm test

# Run E2E tests
cd client && npm run test:e2e

# Run with coverage
npm run test:coverage
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

## 📝 Features

### Bug Management
- **Create Bugs**: Add new bugs with title, description, and status
- **Update Bugs**: Modify existing bug information and status
- **Delete Bugs**: Remove bugs from the system
- **View Bugs**: Display all bugs in a clean, organized list

### Technical Features
- **MERN Stack**: MongoDB, Express.js, React, Node.js
- **RESTful API**: Well-structured API endpoints
- **Error Handling**: Comprehensive error boundaries and logging
- **Testing**: Unit, integration, and E2E tests
- **Performance**: Optimized components with performance monitoring

## 📝 Testing Examples

### Unit Testing

**React Components**
```javascript
// BugForm.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';
import BugForm from './BugForm';

test('submits bug form with valid data', async () => {
  const mockSubmit = jest.fn();

  render(<BugForm onSubmit={mockSubmit} />);

  fireEvent.change(screen.getByLabelText(/title/i), {
    target: { value: 'Login Issue' }
  });

  fireEvent.change(screen.getByLabelText(/description/i), {
    target: { value: 'Cannot login with valid credentials' }
  });

  fireEvent.click(screen.getByRole('button', { name: /submit/i }));

  await waitFor(() => {
    expect(mockSubmit).toHaveBeenCalledWith({
      title: 'Login Issue',
      description: 'Cannot login with valid credentials',
      status: 'open'
    });
  });
});
```

### Integration Testing

**API Endpoints**
```javascript
// bugs.test.js
const request = require('supertest');
const app = require('../server');

describe('POST /api/bugs', () => {
  it('creates a new bug', async () => {
    const response = await request(app)
      .post('/api/bugs')
      .send({
        title: 'Test Bug',
        description: 'This is a test bug',
        status: 'open'
      })
      .expect(201);

    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Test Bug');
  });
});
```

### E2E Testing with Cypress

```javascript
// bug_flows.cy.js
describe('Bug Management', () => {
  it('creates and displays a new bug', () => {
    cy.visit('/');

    cy.get('[data-testid=bug-title]').type('UI Bug');
    cy.get('[data-testid=bug-description]').type('Button styling issue');
    cy.get('[data-testid=submit-bug]').click();

    cy.get('[data-testid=bug-list]').should('contain', 'UI Bug');
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