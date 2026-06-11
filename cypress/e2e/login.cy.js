import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import { interceptLogin, interceptLogout, interceptMenus } from '../support/intercepts';

describe('Login Feature', () => {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    interceptLogin();
    LoginPage.visit();
    cy.wait('@loginPage').its('response.statusCode').should('eq', 200);
  });

  it('TC_LOGIN_001 - displays login page elements', () => {
    LoginPage.logo().should('be.visible');
    LoginPage.usernameInput().should('be.visible');
    LoginPage.passwordInput().should('be.visible');
    LoginPage.submitButton().should('be.visible').and('contain.text', 'Login');
    LoginPage.forgotPasswordLink().should('be.visible');
  });

  it('TC_LOGIN_002 - logs in with valid credential', () => {
    interceptMenus();

    LoginPage.login(Cypress.env('username'), Cypress.env('password'));

    cy.wait('@loginRequest').its('response.statusCode').should('be.oneOf', [200, 302]);
    cy.url().should('include', '/dashboard/index');
    DashboardPage.header().should('contain.text', 'Dashboard');
  });

  it('TC_LOGIN_003 - shows validation when username and password are empty', () => {
    LoginPage.submit();

    LoginPage.requiredMessages().should('have.length', 2);
    LoginPage.requiredMessages().each(($message) => {
      cy.wrap($message).should('contain.text', 'Required');
    });
  });

  it('TC_LOGIN_004 - shows validation when username is empty', () => {
    LoginPage.fillPassword(Cypress.env('password'));
    LoginPage.submit();

    LoginPage.requiredMessages().should('have.length', 1).and('contain.text', 'Required');
  });

  it('TC_LOGIN_005 - shows validation when password is empty', () => {
    LoginPage.fillUsername(Cypress.env('username'));
    LoginPage.submit();

    LoginPage.requiredMessages().should('have.length', 1).and('contain.text', 'Required');
  });

  it('TC_LOGIN_006 - rejects invalid username and password', () => {
    LoginPage.login('wrong-user', 'wrong-password');

    cy.wait('@loginRequest').its('response.statusCode').should('be.oneOf', [200, 302]);
    LoginPage.alertMessage().should('be.visible').and('contain.text', 'Invalid credentials');
    cy.url().should('include', '/auth/login');
  });

  it('TC_LOGIN_007 - opens forgot password page', () => {
    LoginPage.forgotPasswordLink().click();

    cy.url().should('include', '/auth/requestPasswordResetCode');
    cy.contains('h6', 'Reset Password').should('be.visible');
  });

  it('TC_LOGIN_008 - logs out from an authenticated session', () => {
    interceptMenus();
    interceptLogout();

    LoginPage.login(Cypress.env('username'), Cypress.env('password'));
    cy.wait('@loginRequest');
    DashboardPage.logout();

    cy.wait('@logoutRequest').its('response.statusCode').should('be.oneOf', [200, 302]);
    cy.url().should('include', '/auth/login');
    LoginPage.submitButton().should('be.visible');
  });
});
