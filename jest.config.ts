import type { Config } from "jest";

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "jsdom",
  setupFilesAfterFramework: ["<rootDir>/jest.setup.ts"],
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
  testPathPattern: ["**/__tests__/**/*.test.tsx?"],
  collectCoverageFrom: [
    "src/actions/**/*.ts",
    "src/components/admin/**/*.tsx",
    "src/lib/**/*.ts",
  ],
};

export default config;