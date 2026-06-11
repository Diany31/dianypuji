class DirectoryPage {
  visit() {
    cy.visit('/web/index.php/directory/viewDirectory');
  }

  title() {
    return cy.get('.oxd-topbar-header-breadcrumb-module');
  }

  employeeNameInput() {
    return cy.get('input[placeholder="Type for hints..."]');
  }

  jobTitleDropdown() {
    return cy.contains('.oxd-input-group', 'Job Title').find('.oxd-select-text');
  }

  locationDropdown() {
    return cy.contains('.oxd-input-group', 'Location').find('.oxd-select-text');
  }

  searchButton() {
    return cy.get('button[type="submit"]');
  }

  resetButton() {
    return cy.contains('button', 'Reset');
  }

  recordsFound() {
    return cy.get('.orangehrm-horizontal-padding .oxd-text');
  }

  employeeCards() {
    return cy.get('.orangehrm-directory-card');
  }

  noRecordsMessage() {
    return cy.contains('.oxd-text', 'No Records Found');
  }

  forbiddenCode() {
    return cy.contains('.oxd-text', '403');
  }

  forbiddenTitle() {
    return cy.contains('.oxd-text', 'Module Forbidden');
  }

  forbiddenMessage() {
    return cy.contains('.oxd-text', "The page you're trying to access has restricted access");
  }

  sideMenuItem() {
    return cy.contains('.oxd-main-menu-item', 'Directory');
  }

  selectDropdownOption(dropdown, optionText) {
    dropdown.click();
    cy.get('.oxd-select-dropdown').contains(optionText).click();
  }

  searchByEmployeeName(name) {
    this.employeeNameInput().clear().type(name);
    cy.get('.oxd-autocomplete-dropdown').contains(name).click();
    this.searchButton().click();
  }

  searchByJobTitle(jobTitle) {
    this.selectDropdownOption(this.jobTitleDropdown(), jobTitle);
    this.searchButton().click();
  }

  searchByLocation(location) {
    this.selectDropdownOption(this.locationDropdown(), location);
    this.searchButton().click();
  }
}

export default new DirectoryPage();
