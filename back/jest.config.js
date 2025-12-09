module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.js', '**/src/tests/**/*.test.js'],
  maxWorkers: 1,
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/config/db.js',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  testTimeout: 10000,
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.js'],
};
