import './commands';

Cypress.on('uncaught:exception', (error) => {
  const knownOrangeHrmLogoutError = error.message.includes("Cannot read properties of undefined (reading 'response')");

  if (knownOrangeHrmLogoutError) {
    return false;
  }

  return true;
});
