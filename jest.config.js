module.exports = {
  projects: [
    {
      displayName: "server",
      testEnvironment: "node",
      testMatch: ["<rootDir>/tests/server.test.js"],
    },
    {
      displayName: "frontend",
      testEnvironment: "jsdom",
      transform: {
        "^.+\\.tsx?$": "ts-jest",
      },
      testMatch: ["<rootDir>/tests/**/*.test.tsx"],
      moduleNameMapper: {
        "\\.(css|less|sass|scss)$": "<rootDir>/tests/styleMock.js",
      },
    },
  ],
  coverageDirectory: "coverage",
  collectCoverageFrom: ["server.js", "src/**/*.{ts,tsx}"],
};
