/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  setupFiles: ['dotenv/config', './setup-tests.js'],
  setupFilesAfterEnv: ['@testing-library/jest-dom/extend-expect'],
  "moduleFileExtensions": [
    "js",
    "jsx",
    "tsx",
    "ts"
  ],
  moduleNameMapper: {
    '\\.(css)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
  },
  testEnvironment: 'jsdom',
}
