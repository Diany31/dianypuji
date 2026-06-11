class LoginPage {
  visit() {
    cy.visit('/web/index.php/auth/login', { timeout: 90000 });
  }

  logo() {
    return cy.get('.orangehrm-login-branding img');
  }

  usernameInput() {
    return cy.get('input[name="username"]');
  }

  passwordInput() {
    return cy.get('input[name="password"]');
  }

  submitButton() {
    return cy.get('button[type="submit"]');
  }

  alertMessage() {
    return cy.get('.oxd-alert-content-text');
  }

  requiredMessages() {
    return cy.get('.oxd-input-field-error-message');
  }

  forgotPasswordLink() {
    return cy.contains('p', /Forgot Your Password\?/i);
  }

  fillUsername(username) {
    this.usernameInput().clear().type(username);
  }

  fillPassword(password) {
    this.passwordInput().clear().type(password, { log: false });
  }

  submit() {
    this.submitButton().click();
  }

  login(username, password) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.submit();
  }
}

export default new LoginPage();
