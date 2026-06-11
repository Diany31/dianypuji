class DashboardPage {
  header() {
    return cy.get('.oxd-topbar-header-breadcrumb-module');
  }

  userDropdown() {
    return cy.get('.oxd-userdropdown-tab');
  }

  menuItem(menuName) {
    return cy.contains('.oxd-main-menu-item', menuName);
  }

  openMenu(menuName) {
    this.menuItem(menuName).click();
  }

  logout() {
    this.userDropdown().click();
    cy.contains('a', 'Logout').click();
  }
}

export default new DashboardPage();
