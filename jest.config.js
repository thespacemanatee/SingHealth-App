module.exports = {
    rootDir: './',
    testEnvironment: 'node',
    testMatch: ["**/__tests__/**/*.ts?(x)", "**/?(*.)+(test).ts?(x)","**/?(*.)+(test).js?(x)"],
    preset: 'react-native',
    "setupFiles": [
      "<rootDir>/jest/setup.js"
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    verbose: true,
    transform: {
      '^.+\\.(js)$': '<rootDir>/node_modules/babel-jest',
      '\\.(ts|tsx)$': '<rootDir>/node_modules/ts-jest'
    },
    // testMatch: ['<rootDir>/__tests__/**/?(*.)+(spec|test).[jt]s?(x)'], // 只查找__tests__文件夹
    // testRegex: '(/__tests__/.*|\\.(test|spec))\\.(ts|tsx|js)$', // testRegex和testMatch不能同时使用
    testPathIgnorePatterns: ['\\.snap$', '<rootDir>/node_modules/'],
    cacheDirectory: '.jest/cache',
    globals: {
      'ts-jest': {
        diagnostics: {
          ignoreCodes: ['TS2531']
        }
      }
    }
  };