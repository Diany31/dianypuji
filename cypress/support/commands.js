Cypress.Commands.add('openLoginPage', () => {
  cy.visit(Cypress.env('loginPath'));
  cy.get('input[name="username"]').should('be.visible');
  cy.get('input[name="password"]').should('be.visible');
  cy.get('button[type="submit"]').should('be.visible');
});

Cypress.Commands.add('login', (username, password) => {
  if (username) {
    cy.get('input[name="username"]').clear().type(username, { log: false });
  }

  if (password) {
    cy.get('input[name="password"]').clear().type(password, { log: false });
  }

  cy.get('button[type="submit"]').click();
});
