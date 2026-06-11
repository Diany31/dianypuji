const validUser = {
  username: 'Admin',
  password: 'admin123'
};

const assertInvalidCredentials = () => {
  cy.contains('.oxd-alert-content-text', 'Invalid credentials').should('be.visible');
  cy.location('pathname').should('include', Cypress.env('loginPath'));
};

const assertRequiredValidation = (totalMessages) => {
  cy.contains('.oxd-input-field-error-message', 'Required').should('be.visible');
  cy.get('.oxd-input-field-error-message').should('have.length', totalMessages);
  cy.location('pathname').should('include', Cypress.env('loginPath'));
};

describe('OrangeHRM Login Feature', () => {
  beforeEach(() => {
    cy.openLoginPage();
  });

  it('TC-LOGIN-001 - Verifikasi halaman login dapat dibuka dengan benar', () => {
    cy.contains('h5', 'Login').should('be.visible');
    cy.get('input[name="username"]').should('have.attr', 'placeholder', 'Username');
    cy.get('input[name="password"]').should('have.attr', 'placeholder', 'Password');
    cy.get('input[name="password"]').should('have.attr', 'type', 'password');
    cy.get('button[type="submit"]').should('contain.text', 'Login');
    cy.contains('p', 'Username : Admin').should('be.visible');
    cy.contains('p', 'Password : admin123').should('be.visible');
    cy.contains('Forgot your password?').should('be.visible');
  });

  it('TC-LOGIN-002 - Verifikasi user dapat login menggunakan username dan password valid', () => {
    cy.login(validUser.username, validUser.password);

    cy.location('pathname').should('include', Cypress.env('dashboardPath'));
    cy.contains('h6', 'Dashboard').should('be.visible');
  });

  it('TC-LOGIN-003 - Verifikasi login gagal saat username invalid dan password valid', () => {
    cy.login('SalahUser', validUser.password);

    assertInvalidCredentials();
  });

  it('TC-LOGIN-004 - Verifikasi login gagal saat username valid dan password invalid', () => {
    cy.login(validUser.username, 'salahpassword');

    assertInvalidCredentials();
  });

  it('TC-LOGIN-005 - Verifikasi login gagal saat username dan password invalid', () => {
    cy.login('SalahUser', 'SalahPass123');

    assertInvalidCredentials();
  });

  it('TC-LOGIN-006 - Verifikasi validasi Required muncul saat username dan password kosong', () => {
    cy.get('button[type="submit"]').click();

    assertRequiredValidation(2);
  });

  it('TC-LOGIN-007 - Verifikasi validasi Required muncul saat username kosong', () => {
    cy.login('', validUser.password);

    assertRequiredValidation(1);
  });

  it('TC-LOGIN-008 - Verifikasi validasi Required muncul saat password kosong', () => {
    cy.login(validUser.username, '');

    assertRequiredValidation(1);
  });

  it('TC-LOGIN-009 - Verifikasi input password ditampilkan dalam bentuk tersembunyi', () => {
    cy.get('input[name="password"]')
      .type(validUser.password, { log: false })
      .should('have.attr', 'type', 'password')
      .and('have.value', validUser.password);
  });

  it('TC-LOGIN-010 - Verifikasi username dan password bersifat case sensitive', () => {
    cy.login('admin', 'Admin123');

    assertInvalidCredentials();
  });

  it('TC-LOGIN-011 - Verifikasi sistem menangani input dengan spasi di awal dan akhir', () => {
    cy.login(' Admin ', ' admin123 ');

    assertInvalidCredentials();
  });

  it('TC-LOGIN-012 - Verifikasi input menyerupai SQL injection ditolak oleh sistem', () => {
    cy.login("' OR '1'='1", "' OR '1'='1");

    assertInvalidCredentials();
  });

  it('TC-LOGIN-013 - Verifikasi input karakter spesial diproses dengan aman', () => {
    cy.login('!@#$%^&*()', '!@#$%^&*()');

    assertInvalidCredentials();
  });

  it('TC-LOGIN-014 - Verifikasi link Forgot your password dapat diakses', () => {
    cy.contains('Forgot your password?').click();

    cy.location('pathname').should('include', '/web/index.php/auth/requestPasswordResetCode');
    cy.contains('h6', 'Reset Password').should('be.visible');
  });

  it('TC-LOGIN-015 - Verifikasi user tidak dapat mengakses dashboard tanpa session login', () => {
    cy.visit(Cypress.env('dashboardPath'));

    cy.location('pathname').should('include', Cypress.env('loginPath'));
    cy.contains('h5', 'Login').should('be.visible');
  });
});
