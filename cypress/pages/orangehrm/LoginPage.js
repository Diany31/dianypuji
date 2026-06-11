class LoginPage {
  elements = {
    usernameInput: () => cy.get('input[name="username"]'),
    passwordInput: () => cy.get('input[name="password"]'),
    loginButton: () => cy.get('button[type="submit"]'),
    loginTitle: () => cy.contains('h5', 'Login'),
    dashboardTitle: () => cy.contains('h6', 'Dashboard'),
    errorAlert: () => cy.get('.oxd-alert-content-text'),
    requiredMessages: () => cy.get('.oxd-input-field-error-message'),
    forgotPasswordLink: () => cy.contains('Forgot your password?'),
    resetPasswordTitle: () => cy.contains('h6', 'Reset Password')
  };

  open() {
    cy.visit(Cypress.env('loginPath'));
  }

  openDashboardDirectly() {
    cy.visit(Cypress.env('dashboardPath'));
  }

  verifyLoginPageDisplayed() {
    this.elements.loginTitle().should('be.visible');
    this.elements.usernameInput().should('be.visible').and('have.attr', 'placeholder', 'Username');
    this.elements.passwordInput().should('be.visible').and('have.attr', 'placeholder', 'Password');
    this.elements.loginButton().should('be.visible').and('contain.text', 'Login');
    this.elements.forgotPasswordLink().should('be.visible');
  }

  inputUsername(username) {
    if (username) {
      this.elements.usernameInput().clear().type(username, { log: false });
    }
  }

  inputPassword(password) {
    if (password) {
      this.elements.passwordInput().clear().type(password, { log: false });
    }
  }

  clickLoginButton() {
    this.elements.loginButton().click();
  }

  login(username, password) {
    this.inputUsername(username);
    this.inputPassword(password);
    this.clickLoginButton();
  }

  verifyDashboardDisplayed() {
    cy.location('pathname').should('include', Cypress.env('dashboardPath'));
    this.elements.dashboardTitle().should('be.visible');
  }

  verifyInvalidCredentialsMessage() {
    this.elements.errorAlert().should('be.visible').and('contain.text', 'Invalid credentials');
    cy.location('pathname').should('include', Cypress.env('loginPath'));
  }

  verifyRequiredValidation(totalMessages) {
    this.elements.requiredMessages().should('have.length', totalMessages);
    this.elements.requiredMessages().first().should('contain.text', 'Required');
    cy.location('pathname').should('include', Cypress.env('loginPath'));
  }

  verifyPasswordIsMasked(password) {
    this.elements.passwordInput()
      .type(password, { log: false })
      .should('have.attr', 'type', 'password')
      .and('have.value', password);
  }

  openForgotPasswordPage() {
    this.elements.forgotPasswordLink().click();
  }

  verifyResetPasswordPageDisplayed() {
    cy.location('pathname').should('include', '/web/index.php/auth/requestPasswordResetCode');
    this.elements.resetPasswordTitle().should('be.visible');
  }
}

export default LoginPage;
