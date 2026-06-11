import LoginPage from '../../pages/orangehrm/LoginPage';
import loginData from '../../fixtures/orangehrm/loginData.json';

const loginPage = new LoginPage();

describe('OrangeHRM Login Feature - POM', () => {
  beforeEach(() => {
    loginPage.open();
  });

  it('TC-LOGIN-001 - Verifikasi halaman login dapat dibuka dengan benar', () => {
    loginPage.verifyLoginPageDisplayed();
  });

  it('TC-LOGIN-002 - Verifikasi user dapat login menggunakan username dan password valid', () => {
    loginPage.login(loginData.validUser.username, loginData.validUser.password);

    loginPage.verifyDashboardDisplayed();
  });

  it('TC-LOGIN-003 - Verifikasi login gagal saat username invalid dan password valid', () => {
    loginPage.login(loginData.invalidUsernameUser.username, loginData.invalidUsernameUser.password);

    loginPage.verifyInvalidCredentialsMessage();
  });

  it('TC-LOGIN-004 - Verifikasi login gagal saat username valid dan password invalid', () => {
    loginPage.login(loginData.invalidPasswordUser.username, loginData.invalidPasswordUser.password);

    loginPage.verifyInvalidCredentialsMessage();
  });

  it('TC-LOGIN-005 - Verifikasi login gagal saat username dan password invalid', () => {
    loginPage.login(loginData.invalidCredentialUser.username, loginData.invalidCredentialUser.password);

    loginPage.verifyInvalidCredentialsMessage();
  });

  it('TC-LOGIN-006 - Verifikasi validasi Required muncul saat username dan password kosong', () => {
    loginPage.clickLoginButton();

    loginPage.verifyRequiredValidation(2);
  });

  it('TC-LOGIN-007 - Verifikasi validasi Required muncul saat username kosong', () => {
    loginPage.login(loginData.emptyUser.username, loginData.validUser.password);

    loginPage.verifyRequiredValidation(1);
  });

  it('TC-LOGIN-008 - Verifikasi validasi Required muncul saat password kosong', () => {
    loginPage.login(loginData.validUser.username, loginData.emptyUser.password);

    loginPage.verifyRequiredValidation(1);
  });

  it('TC-LOGIN-009 - Verifikasi input password ditampilkan dalam bentuk tersembunyi', () => {
    loginPage.verifyPasswordIsMasked(loginData.validUser.password);
  });

  it('TC-LOGIN-010 - Verifikasi username dan password bersifat case sensitive', () => {
    loginPage.login(loginData.caseSensitiveUser.username, loginData.caseSensitiveUser.password);

    loginPage.verifyInvalidCredentialsMessage();
  });

  it('TC-LOGIN-011 - Verifikasi sistem menangani input dengan spasi di awal dan akhir', () => {
    loginPage.login(loginData.spaceUser.username, loginData.spaceUser.password);

    loginPage.verifyInvalidCredentialsMessage();
  });

  it('TC-LOGIN-012 - Verifikasi input menyerupai SQL injection ditolak oleh sistem', () => {
    loginPage.login(loginData.sqlInjectionUser.username, loginData.sqlInjectionUser.password);

    loginPage.verifyInvalidCredentialsMessage();
  });

  it('TC-LOGIN-013 - Verifikasi input karakter spesial diproses dengan aman', () => {
    loginPage.login(loginData.specialCharacterUser.username, loginData.specialCharacterUser.password);

    loginPage.verifyInvalidCredentialsMessage();
  });

  it('TC-LOGIN-014 - Verifikasi link Forgot your password dapat diakses', () => {
    loginPage.openForgotPasswordPage();

    loginPage.verifyResetPasswordPageDisplayed();
  });

  it('TC-LOGIN-015 - Verifikasi user tidak dapat mengakses dashboard tanpa session login', () => {
    loginPage.openDashboardDirectly();

    loginPage.verifyLoginPageDisplayed();
    cy.location('pathname').should('include', Cypress.env('loginPath'));
  });
});
