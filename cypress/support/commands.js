import LoginPage from '../pages/LoginPage';
import { interceptLogin, interceptMenus } from './intercepts';

Cypress.Commands.add('login', () => {
  cy.session([Cypress.env('username'), Cypress.env('password')], () => {
    interceptLogin();
    interceptMenus();

    LoginPage.visit();
    LoginPage.usernameInput().should('be.visible');
    LoginPage.fillUsername(Cypress.env('username'));
    LoginPage.fillPassword(Cypress.env('password'));
    LoginPage.submit();

    cy.wait('@loginRequest').its('response.statusCode').should('be.oneOf', [200, 302]);
    cy.url().should('include', '/dashboard/index');
  }, {
    validate() {
      cy.request('/web/index.php/dashboard/index').its('status').should('eq', 200);
    }
  });

  cy.visit('/web/index.php/dashboard/index');
  cy.url().should('include', '/dashboard/index');
});
