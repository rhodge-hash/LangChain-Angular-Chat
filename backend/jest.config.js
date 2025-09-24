/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'node',
  transform: {
    '^.+\.(js|jsx|ts|tsx)$' : 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(@langchain|langchain|langgraph)/)'
  ],
  moduleFileExtensions: ['js', 'json', 'node'],
};

export default config;
