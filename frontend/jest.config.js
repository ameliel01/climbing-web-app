module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  transformIgnorePatterns: [
    "/node_modules/(?!axios)" // 👉 Transpile axios malgré qu’il soit dans node_modules
  ],
  moduleNameMapper: {
    "\\.(css|less|scss)$": "identity-obj-proxy"
  },
  moduleFileExtensions: ["js", "jsx"],
};
