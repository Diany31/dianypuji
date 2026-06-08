const validUser = {
  username: 'Admin',
  password: 'admin123'
};

const assertLoginPageIsReady = () => {
  cy.contains('h5', 'Login').should('be.visible');
  cy.get('input[name="username"]').should('be.visible');
  cy.get('input[name="password"]').should('be.visible');
  cy.get('button[type="submit"]').should('be.visible');
};

describe('OrangeHRM Login Feature - Intercept Tests', () => {
  it('TC-LOGIN-INT-001 - Intercept halaman login berhasil dimuat', () => {
    cy.intercept('GET', '**/web/index.php/auth/login').as('getLoginPage');

    cy.visit(Cypress.env('loginPath'));

    cy.wait('@getLoginPage').then(({ response }) => {
      expect(response.statusCode).to.eq(200);
      expect(response.headers['content-type']).to.include('text/html');
    });
    assertLoginPageIsReady();
  });

  it('TC-LOGIN-INT-002 - Intercept request login valid ke endpoint auth validate', () => {
    cy.intercept('POST', '**/web/index.php/auth/validate').as('postValidLogin');

    cy.openLoginPage();
    cy.login(validUser.username, validUser.password);

    cy.wait('@postValidLogin').then(({ request, response }) => {
      expect(request.method).to.eq('POST');
      expect(String(request.body)).to.include(`username=${validUser.username}`);
      expect(String(request.body)).to.include(`password=${validUser.password}`);
      expect(response.statusCode).to.be.oneOf([200, 302]);
    });
    cy.location('pathname').should('include', Cypress.env('dashboardPath'));
  });

  it('TC-LOGIN-INT-003 - Intercept request login dengan username invalid', () => {
    cy.intercept('POST', '**/web/index.php/auth/validate').as('postInvalidUsername');

    cy.openLoginPage();
    cy.login('SalahUser', validUser.password);

    cy.wait('@postInvalidUsername').then(({ request, response }) => {
      expect(request.method).to.eq('POST');
      expect(String(request.body)).to.include('username=SalahUser');
      expect(String(request.body)).to.include(`password=${validUser.password}`);
      expect(response.statusCode).to.be.oneOf([200, 302]);
    });
    cy.contains('.oxd-alert-content-text', 'Invalid credentials').should('be.visible');
  });

  it('TC-LOGIN-INT-004 - Intercept request login dengan password invalid', () => {
    cy.intercept('POST', '**/web/index.php/auth/validate').as('postInvalidPassword');

    cy.openLoginPage();
    cy.login(validUser.username, 'salahpassword');

    cy.wait('@postInvalidPassword').then(({ request, response }) => {
      expect(request.method).to.eq('POST');
      expect(String(request.body)).to.include(`username=${validUser.username}`);
      expect(String(request.body)).to.include('password=salahpassword');
      expect(response.statusCode).to.be.oneOf([200, 302]);
    });
    cy.contains('.oxd-alert-content-text', 'Invalid credentials').should('be.visible');
  });

  it('TC-LOGIN-INT-005 - Intercept navigasi forgot password', () => {
    cy.intercept('GET', '**/web/index.php/auth/requestPasswordResetCode').as('getForgotPasswordPage');

    cy.openLoginPage();
    cy.contains('Forgot your password?').click();

    cy.wait('@getForgotPasswordPage').then(({ request, response }) => {
      expect(request.method).to.eq('GET');
      expect(response.statusCode).to.eq(200);
      expect(response.headers['content-type']).to.include('text/html');
    });
    cy.contains('h6', 'Reset Password').should('be.visible');
  });

  it('TC-LOGIN-INT-006 - Intercept akses dashboard tanpa session login', () => {
    cy.intercept('GET', '**/web/index.php/dashboard/index').as('getDashboardWithoutSession');

    cy.visit(Cypress.env('dashboardPath'));

    cy.wait('@getDashboardWithoutSession').then(({ request, response }) => {
      expect(request.method).to.eq('GET');
      expect(response.statusCode).to.be.oneOf([200, 302]);
    });
    cy.location('pathname').should('include', Cypress.env('loginPath'));
    assertLoginPageIsReady();
  });
});
