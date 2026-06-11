import DashboardPage from '../pages/DashboardPage';
import RecruitmentPage from '../pages/RecruitmentPage';
import { interceptRecruitment } from '../support/intercepts';

describe('Recruitment Feature', () => {
  beforeEach(() => {
    cy.login();
    interceptRecruitment();
    DashboardPage.openMenu('Recruitment');
    cy.wait('@candidates').its('response.statusCode').should('eq', 200);
  });

  it('TC_RECRUITMENT_001 - opens recruitment candidates page from sidebar menu', () => {
    cy.url().should('include', '/recruitment/viewCandidates');
    RecruitmentPage.title().should('contain.text', 'Recruitment');
    RecruitmentPage.addButton().should('be.visible');
    RecruitmentPage.searchButton().should('be.visible');
    RecruitmentPage.resetButton().should('be.visible');
  });

  it('TC_RECRUITMENT_002 - loads candidates through recruitment API', () => {
    RecruitmentPage.recordsFound().should('contain.text', 'Records Found');
    RecruitmentPage.candidateRows().should('have.length.greaterThan', 0);
  });

  it('TC_RECRUITMENT_003 - filters candidates by vacancy', () => {
    RecruitmentPage.selectDropdownOption('Vacancy', 'Payroll Administrator');
    RecruitmentPage.searchButton().click();

    cy.wait('@candidates').its('response.statusCode').should('eq', 200);
    RecruitmentPage.recordsFound().should('be.visible');
  });

  it('TC_RECRUITMENT_004 - filters candidates by hiring manager', () => {
    RecruitmentPage.selectDropdownOption('Hiring Manager', 'Rahul Patil');
    RecruitmentPage.searchButton().click();

    cy.wait('@candidates').its('response.statusCode').should('eq', 200);
    RecruitmentPage.recordsFound().should('be.visible');
  });

  it('TC_RECRUITMENT_005 - filters candidates by status', () => {
    RecruitmentPage.selectDropdownOption('Status', 'Application Initiated');
    RecruitmentPage.searchButton().click();

    cy.wait('@candidates').its('response.statusCode').should('eq', 200);
    RecruitmentPage.recordsFound().should('be.visible');
  });

  it('TC_RECRUITMENT_006 - resets candidate filters', () => {
    RecruitmentPage.keywordsInput().type('QA');
    RecruitmentPage.selectDropdownOption('Status', 'Application Initiated');
    RecruitmentPage.searchButton().click();
    cy.wait('@candidates');

    RecruitmentPage.resetButton().click();

    cy.wait('@candidates').its('response.statusCode').should('eq', 200);
    RecruitmentPage.keywordsInput().should('have.value', '');
    RecruitmentPage.dropdownByLabel('Status').should('contain.text', '-- Select --');
  });

  it('TC_RECRUITMENT_007 - validates required fields on add candidate form', () => {
    RecruitmentPage.openAddCandidateForm();
    RecruitmentPage.saveButton().click();

    RecruitmentPage.requiredMessages().should('have.length.at.least', 3);
    RecruitmentPage.requiredMessages().each(($message) => {
      cy.wrap($message).should('contain.text', 'Required');
    });
  });

  it('TC_RECRUITMENT_008 - adds a candidate with valid data', () => {
    cy.fixture('candidates').then(({ validCandidate }) => {
      const uniqueCandidate = {
        ...validCandidate,
        email: `andi.qa.${Date.now()}@example.com`
      };

      RecruitmentPage.addCandidate(uniqueCandidate);

      cy.wait('@createCandidate').its('response.statusCode').should('be.oneOf', [200, 201]);
      RecruitmentPage.successToast().should('be.visible');
      cy.url().should('include', '/recruitment/addCandidate');
    });
  });
});
