# Research Findings: Testing Frameworks

## Angular Frontend Testing

### Unit/Integration Testing
- **Decision**: Jest
- **Rationale**: Jest is a popular testing framework with a developer-friendly experience, built-in assertion library, and mocking capabilities. Angular is also working towards more official integration with Jest, making it a forward-looking choice for Angular projects.
- **Alternatives considered**: Jasmine/Karma (default but Jest offers better performance and features), Spectator (simplifies testing but builds on Jasmine/Karma).

### End-to-End (E2E) Testing
- **Decision**: Cypress
- **Rationale**: Cypress is a modern, popular, and easy-to-use E2E testing tool known for its fast execution, debugging capabilities, and comprehensive feature set. It's a strong choice for Angular E2E testing, especially with Protractor's deprecation.
- **Alternatives considered**: Playwright (also a strong contender, but Cypress is often cited for its ease of use for initial setup), WebdriverIO, Nightwatch.js (less common for new Angular projects).

## Node.js/Express.js Backend Testing

### Unit/Integration/API Testing
- **Decision**: Jest
- **Rationale**: Jest provides an all-in-one testing solution with a built-in test runner, assertion library, and mocking. Its consistency with the chosen frontend unit testing framework (Jest for Angular) simplifies the development and testing workflow across the full stack. It's well-suited for testing Express.js APIs with its ability to handle HTTP requests and assertions.
- **Alternatives considered**: Mocha/Chai/Supertest (a common and flexible combination, but Jest's all-in-one nature reduces configuration overhead), Sinon.js (for test doubles, can be used with Jest), Vitest (newer, but Jest is more established for Node.js projects currently).
