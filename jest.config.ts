

// const config= {


//   // The directory where Jest should output its coverage files
//   coverageDirectory: "coverage",


//   moduleNameMapper: {
//     '^@/(.*)$': '<rootDir>/src/$1',
//     // '^nanoid$': require.resolve('nanoid'),
//   },

//   transform: {
//     '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
//   },
//   transformIgnorePatterns: [
//     '/node_modules/(?!.*nanoid)',
//   ],

//   setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
// };



import type { Config } from 'jest'
import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files in your test environment
  dir: './',
})
 
// Add any custom config to be passed to Jest
const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  // Add more setup options before each test is run
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)