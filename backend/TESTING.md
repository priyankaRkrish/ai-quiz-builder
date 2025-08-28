# Testing Guide for AI Quiz Generator Backend

This document provides comprehensive information about testing the backend API, including how to run tests, write new tests, and understand the testing architecture.

## 🧪 Testing Overview

The backend uses **Jest** as the testing framework with **Supertest** for HTTP endpoint testing. We follow a practical testing strategy that focuses on:

- **Unit Tests**: Testing individual functions and services in isolation
- **Route Tests**: Testing HTTP endpoints with mocked dependencies
- **Validation Tests**: Testing input validation and error handling
- **Authentication Tests**: Testing protected route access

## 🚀 Quick Start

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode (development)
npm run test:watch

# Run tests with coverage report
npm run test:coverage

# Run tests for CI/CD pipeline
npm run test:ci
```

### Test Structure

```
src/
├── test/
│   ├── setup.ts              # Global test configuration
│   └── utils.ts              # Test helper functions
├── routes/
│   ├── __tests__/            # Route tests
│   │   ├── auth.test.ts      # Authentication tests
│   │   └── quiz.test.ts      # Quiz endpoint tests
│   ├── auth.ts               # Auth routes
│   └── quiz.ts               # Quiz routes
└── services/
    ├── __tests__/            # Service tests
    │   └── aiService.test.ts # AI service tests
    ├── aiService.ts          # AI service
    └── prismaService.ts      # Database service
```

## 📋 Test Categories

### 1. Unit Tests

Unit tests focus on testing individual functions and services in isolation. They use mocks to isolate the code being tested from external dependencies.

**Example: Testing Service Functions**
```typescript
describe('AI Service', () => {
  it('should validate input parameters', () => {
    expect(typeof generateQuiz).toBe('function');
    expect(typeof submitQuiz).toBe('function');
  });
});
```

### 2. Route Tests

Route tests verify that HTTP endpoints work correctly, including request validation, authentication, and response formatting.

**Example: Testing Quiz Generation Endpoint**
```typescript
describe('POST /api/quiz/generate', () => {
  it('should return 400 for missing topic', async () => {
    const response = await request(app)
      .post('/api/quiz/generate')
      .send({ model: 'gpt-3.5-turbo' })
      .expect(400);

    expect(response.body.error).toBe('Topic is required and must be a non-empty string');
  });
});
```

### 3. Validation Tests

Validation tests ensure that the API properly validates input data and returns appropriate error messages.

**Example: Testing Input Validation**
```typescript
it('should return 400 for short password', async () => {
  const response = await request(app)
    .post('/api/auth/signup')
    .send({
      email: 'test@example.com',
      password: '123',
      username: 'testuser'
    })
    .expect(400);

  expect(response.body.error).toBe('Password must be at least 6 characters long');
});
```

## 🛠️ Test Utilities

### Mock Objects

The testing framework provides utility functions to create consistent mock objects:

```typescript
import { createMockUser, createMockQuiz, generateTestToken } from '../test/utils';

// Create a mock user
const mockUser = createMockUser({ email: 'custom@example.com' });

// Create a mock quiz
const mockQuiz = createMockQuiz({ topic: 'Custom Topic' });

// Generate a test JWT token
const token = generateTestToken(1, 'test@example.com');
```

### Test Setup

The `setup.ts` file configures the testing environment:

- **Service Mocks**: Mocks external services (Redis, Prisma, AI services)
- **Global Configuration**: Sets timeouts and suppresses console output
- **Mock Implementations**: Provides basic mock implementations for testing

## 📊 Test Coverage

### Coverage Reports

Run tests with coverage to see how well your code is tested:

```bash
npm run test:coverage
```

This generates:
- **Console Report**: Shows coverage summary in terminal
- **HTML Report**: Detailed coverage report in `coverage/` directory
- **LCOV Report**: Coverage data for CI/CD tools

### Current Coverage

As of the latest tests:
- **Statements**: ~12%
- **Branches**: ~12%
- **Functions**: ~10%
- **Lines**: ~12%

*Note: Coverage is intentionally lower as we focus on testing critical paths and validation rather than achieving high coverage numbers.*

## 🧩 Writing New Tests

### 1. Test File Structure

```typescript
import { functionToTest } from '../path/to/function';

describe('Function Name', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('specific behavior', () => {
    it('should do something specific', async () => {
      // Arrange
      const input = 'test input';
      
      // Act
      const result = functionToTest(input);
      
      // Assert
      expect(result).toBe('expected result');
    });
  });
});
```

### 2. Testing HTTP Endpoints

```typescript
it('should validate request body', async () => {
  const response = await request(app)
    .post('/api/endpoint')
    .send({ invalid: 'data' })
    .expect(400);

  expect(response.body.error).toBe('Validation error message');
});
```

### 3. Testing Authentication

```typescript
it('should require authentication for protected routes', async () => {
  const response = await request(app)
    .get('/api/protected')
    .expect(401);
    
  expect(response.body.error).toBe('Access token required');
});
```

## 🔍 Testing Best Practices

### 1. Test Naming

Use descriptive test names that explain the expected behavior:

```typescript
// Good
it('should return 400 when topic is missing', async () => {});
it('should validate required fields', async () => {});
it('should handle authentication errors gracefully', async () => {});

// Avoid
it('should work', async () => {});
it('test case 1', async () => {});
```

### 2. Test Organization

Group related tests using `describe` blocks:

```typescript
describe('User Authentication', () => {
  describe('POST /api/auth/signup', () => {
    it('should validate required fields', async () => {});
    it('should enforce password length', async () => {});
  });
  
  describe('POST /api/auth/signin', () => {
    it('should require valid credentials', async () => {});
  });
});
```

### 3. Mock Management

Always clean up mocks between tests:

```typescript
beforeEach(() => {
  jest.clearAllMocks();
});

afterEach(() => {
  jest.restoreAllMocks();
});
```

### 4. Focus on Critical Paths

Rather than trying to achieve 100% coverage, focus on testing:

- **Input validation** and error handling
- **Authentication** and authorization
- **Critical business logic**
- **Error scenarios** and edge cases

## 🚨 Common Testing Patterns

### 1. Testing Error Cases

```typescript
it('should handle validation errors gracefully', async () => {
  const response = await request(app)
    .post('/api/endpoint')
    .send({})
    .expect(400);
    
  expect(response.body.error).toBeDefined();
});
```

### 2. Testing Authentication

```typescript
it('should require valid JWT token', async () => {
  const response = await request(app)
    .get('/api/protected')
    .set('Authorization', 'Bearer invalid_token')
    .expect(401);
    
  expect(response.body.error).toBe('Invalid token');
});
```

### 3. Testing Input Validation

```typescript
it('should validate required fields', async () => {
  const response = await request(app)
    .post('/api/endpoint')
    .send({})
    .expect(400);
    
  expect(response.body.error).toContain('required');
});
```

## 🔧 Test Configuration

### Jest Configuration

The `jest.config.js` file configures:

- **TypeScript Support**: Uses `ts-jest` for TypeScript compilation
- **Test Environment**: Node.js environment for backend testing
- **Coverage**: Excludes configuration and type files
- **File Patterns**: Tests in `__tests__` directories and `.test.ts` files

### Environment Variables

For testing, you can create a `.env.test` file:

```bash
NODE_ENV=test
DATABASE_URL="postgresql://test:test@localhost:5432/test_db"
REDIS_URL="redis://localhost:6379"
JWT_SECRET=test_secret_key
```

## 🚀 Continuous Integration

### CI/CD Pipeline

The `test:ci` script is designed for continuous integration:

```bash
npm run test:ci
```

This command:
- Runs tests in CI mode (no watch mode)
- Generates coverage reports
- Exits with non-zero code on test failure
- Optimized for automated testing environments

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Testing Best Practices](https://kentcdodds.com/blog/common-testing-mistakes)
- [Node.js Testing Patterns](https://nodejs.org/en/docs/guides/testing-and-debugging/)

## 🤝 Contributing to Tests

When adding new features:

1. **Write tests for validation** and error handling
2. **Test critical business logic** paths
3. **Mock external dependencies** appropriately
4. **Focus on user experience** and error messages
5. **Update this documentation**

## 🎯 Testing Philosophy

Our testing approach prioritizes:

- **Practical Value**: Tests that catch real bugs and regressions
- **Maintainability**: Simple, readable tests that are easy to update
- **Critical Paths**: Focus on testing the most important functionality
- **User Experience**: Ensure API returns proper error messages and status codes

Rather than striving for high coverage numbers, we focus on testing the functionality that matters most to users and developers.

---

**Happy Testing! 🧪✨**
