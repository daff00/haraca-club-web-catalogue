import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          jsx: "react-jsx",
        },
      },
    ],
  },
  testMatch: [
    "<rootDir>/src/**/__tests__/**/*.test.ts?(x)",
    "<rootDir>/src/**/*.test.ts?(x)",
  ],
  collectCoverageFrom: [
    "src/actions/**/*.ts",
    "src/components/admin/**/*.tsx",
    "src/components/public/**/*.tsx",
    "src/lib/**/*.ts",
  ],
};

export default config;