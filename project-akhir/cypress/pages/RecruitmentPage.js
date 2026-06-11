class RecruitmentPage {
  visit() {
    cy.visit('/web/index.php/recruitment/viewCandidates');
  }

  title() {
    return cy.get('.oxd-topbar-header-breadcrumb-module');
  }

  addButton() {
    return cy.contains('button', 'Add');
  }

  saveButton() {
    return cy.contains('button', 'Save');
  }

  cancelButton() {
    return cy.contains('button', 'Cancel');
  }

  searchButton() {
    return cy.get('button[type="submit"]');
  }

  resetButton() {
    return cy.contains('button', 'Reset');
  }

  candidateNameInput() {
    return cy.get('input[placeholder="Type for hints..."]');
  }

  keywordsInput() {
    return cy.contains('.oxd-input-group', 'Keywords').find('input');
  }

  dropdownByLabel(label) {
    return cy.contains('.oxd-input-group', label).find('.oxd-select-text');
  }

  firstNameInput() {
    return cy.get('input[name="firstName"]');
  }

  middleNameInput() {
    return cy.get('input[name="middleName"]');
  }

  lastNameInput() {
    return cy.get('input[name="lastName"]');
  }

  emailInput() {
    return cy.contains('.oxd-input-group', 'Email').find('input');
  }

  contactNumberInput() {
    return cy.contains('.oxd-input-group', 'Contact Number').find('input');
  }

  requiredMessages() {
    return cy.get('.oxd-input-field-error-message');
  }

  successToast() {
    return cy.get('.oxd-toast--success');
  }

  recordsFound() {
    return cy.get('.orangehrm-horizontal-padding .oxd-text');
  }

  candidateRows() {
    return cy.get('.oxd-table-card');
  }

  selectDropdownOption(label, optionText) {
    this.dropdownByLabel(label).click();
    cy.get('.oxd-select-dropdown').contains(optionText).click();
  }

  openAddCandidateForm() {
    this.addButton().click();
    cy.url().should('include', '/recruitment/addCandidate');
  }

  fillCandidateForm(candidate) {
    this.firstNameInput().clear().type(candidate.firstName);
    if (candidate.middleName) {
      this.middleNameInput().clear().type(candidate.middleName);
    }
    this.lastNameInput().clear().type(candidate.lastName);
    this.emailInput().clear().type(candidate.email);

    if (candidate.contactNumber) {
      this.contactNumberInput().clear().type(candidate.contactNumber);
    }
  }

  addCandidate(candidate) {
    this.openAddCandidateForm();
    this.fillCandidateForm(candidate);
    this.saveButton().click();
  }
}

export default new RecruitmentPage();
