module.exports = {
  // Override CRA's default collectCoverageFrom
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/index.tsx',
    '!src/reportWebVitals.ts',
    '!src/types/index.ts',
    '!src/**/*.d.ts',
    '!src/setupTests.ts',
    '!src/**/__tests__/**',
    '!src/**/*.test.{js,jsx,ts,tsx}',
    '!src/**/*.spec.{js,jsx,ts,tsx}',
  ],

  // Coverage thresholds - will cause tests to fail if not met
  coverageThreshold: {
    global: {
      branches: 35, // Realistic thresholds based on current coverage
      functions: 29,
      lines: 32,
      statements: 35,
    },
  },

  // Coverage reporters
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],

  // Coverage directory
  coverageDirectory: 'coverage',

  // Clear mocks between tests
  clearMocks: true,

  // Ensure thresholds are enforced
  coveragePathIgnorePatterns: [
    '/node_modules/',
    'src/index.tsx',
    'src/reportWebVitals.ts',
    'src/types/index.ts',
  ],
};
