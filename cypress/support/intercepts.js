export const interceptLogin = () => {
  cy.intercept('GET', '**/web/index.php/auth/login').as('loginPage');
  cy.intercept('POST', '**/web/index.php/auth/validate').as('loginRequest');
};

export const interceptMenus = () => {
  cy.intercept('GET', '**/api/v2/admin/menus*').as('menusRequest');
};

export const interceptDashboard = () => {
  cy.intercept('GET', '**/api/v2/dashboard/**').as('dashboardRequest');
};

export const interceptDirectory = () => {
  cy.intercept('GET', '**/api/v2/directory/employees*').as('directoryEmployees');
  cy.intercept('GET', '**/api/v2/admin/job-titles*').as('jobTitles');
  cy.intercept('GET', '**/api/v2/admin/locations*').as('locations');
  cy.intercept('GET', '**/api/v2/pim/employees*').as('employeeHints');
};

export const interceptRecruitment = () => {
  cy.intercept('GET', '**/api/v2/recruitment/candidates*').as('candidates');
  cy.intercept('GET', '**/api/v2/recruitment/vacancies*').as('vacancies');
  cy.intercept('GET', '**/api/v2/admin/job-titles*').as('recruitmentJobTitles');
  cy.intercept('POST', '**/api/v2/recruitment/candidates').as('createCandidate');
  cy.intercept('PUT', '**/api/v2/recruitment/candidates/*').as('updateCandidate');
  cy.intercept('DELETE', '**/api/v2/recruitment/candidates').as('deleteCandidate');
};

export const interceptLogout = () => {
  cy.intercept('GET', '**/web/index.php/auth/logout').as('logoutRequest');
};
