const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://opensource-demo.orangehrmlive.com',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1366,
    viewportHeight: 768,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 90000,
    requestTimeout: 15000,
    responseTimeout: 20000,
    retries: {
      runMode: 1,
      openMode: 0
    },
    env: {
      username: 'Admin',
      password: 'admin123'
    }
  }
});
