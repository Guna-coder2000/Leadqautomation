# Playwright POM TypeScript Automation Framework

This project is a Playwright automation framework built using TypeScript, following the Page Object Model (POM) structure. It is designed to facilitate automated testing for web applications across multiple environments (DEV, UAT, STAGING) and includes Allure reporting integration.

## Project Structure

```
playwright-pom-ts
├── src
│   ├── pages
│   │   ├── BasePage.ts        # Abstract class for common page methods
│   │   ├── LoginPage.ts       # Page object for login functionality
│   │   └── HomePage.ts        # Page object for home page functionality
│   ├── fixtures
│   │   └── testFixtures.ts     # Fixture for automatic page class creation
│   ├── tests
│   │   ├── e2e
│   │   │   └── login.spec.ts   # End-to-end tests for login
│   │   └── api
│   │       └── health.spec.ts   # API tests for application health
│   ├── utils
│   │   ├── env.ts              # Environment configuration utilities
│   │   └── helpers.ts          # Utility functions for tests and pages
│   └── configs
│       ├── dev.json            # DEV environment configurations
│       ├── uat.json            # UAT environment configurations
│       └── staging.json        # STAGING environment configurations
├── playwright.config.ts         # Playwright configuration file
├── package.json                 # NPM configuration file
├── tsconfig.json                # TypeScript configuration file
├── .github
│   └── workflows
│       └── ci.yml              # CI workflow configuration
└── README.md                    # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd playwright-pom-ts
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Configure environments:**
   Update the configuration files in the `src/configs` directory (`dev.json`, `uat.json`, `staging.json`) with the appropriate settings for each environment.

4. **Run tests:**
   You can run tests in different environments using the following command:
   ```
   npm run test -- --config=src/configs/<environment>.json
   ```
   Replace `<environment>` with `dev`, `uat`, or `staging`.

5. **Generate Allure reports:**
   After running tests, you can generate Allure reports using:
   ```
   allure generate --clean
   allure open
   ```

## Usage Examples

- To run end-to-end tests for login functionality, navigate to the `src/tests/e2e` directory and execute:
  ```
  npx playwright test login.spec.ts
  ```

- For API health checks, navigate to the `src/tests/api` directory and execute:
  ```
  npx playwright test health.spec.ts
  ```

## Contributing

Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License

This project is licensed under the MIT License.