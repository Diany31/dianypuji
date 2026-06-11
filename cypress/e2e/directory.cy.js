import DirectoryPage from '../pages/DirectoryPage';
import { interceptDirectory } from '../support/intercepts';

describe('Directory Feature', () => {
  const whenDirectoryReady = (accessibleFlow, restrictedFlow = () => {
    DirectoryPage.forbiddenTitle().should('be.visible');
  }) => {
    cy.get('body').then(($body) => {
      const isRestricted = $body.text().includes('Module Forbidden');

      if (isRestricted) {
        restrictedFlow();
        return;
      }

      accessibleFlow();
    });
  };

  const selectFirstRealOption = (dropdown) => {
    dropdown.click();

    cy.get('.oxd-select-dropdown [role="option"]')
      .not(':contains("-- Select --")')
      .first()
      .click();
  };

  beforeEach(() => {
    cy.login();
    interceptDirectory();
    cy.intercept('GET', '**/web/index.php/directory/viewDirectory').as('directoryPage');

    DirectoryPage.visit();
    cy.wait('@directoryPage').its('response.statusCode').should('eq', 200);
  });

  it('TC_DIRECTORY_001 - opens directory route', () => {
    cy.url().should('include', '/directory/viewDirectory');
    DirectoryPage.title().should('contain.text', 'Directory');
  });

  it('TC_DIRECTORY_002 - shows module forbidden status code', () => {
    whenDirectoryReady(() => {
      DirectoryPage.recordsFound().should('contain.text', 'Records Found');
    }, () => {
      DirectoryPage.forbiddenCode().should('be.visible');
      DirectoryPage.forbiddenTitle().should('be.visible');
    });
  });

  it('TC_DIRECTORY_003 - shows restricted access message', () => {
    whenDirectoryReady(() => {
      DirectoryPage.employeeNameInput().should('be.visible');
      DirectoryPage.jobTitleDropdown().should('be.visible');
      DirectoryPage.locationDropdown().should('be.visible');
    }, () => {
      DirectoryPage.forbiddenMessage().should('be.visible');
    });
  });

  it('TC_DIRECTORY_004 - keeps Directory sidebar item visible', () => {
    DirectoryPage.sideMenuItem().should('be.visible');
    DirectoryPage.sideMenuItem().should('have.class', 'active');
  });

  it('TC_DIRECTORY_005 - searches directory by employee name when module is available', () => {
    whenDirectoryReady(() => {
      DirectoryPage.employeeNameInput().type('a');
      cy.wait('@directoryEmployees').its('response.statusCode').should('eq', 200);

      cy.get('.oxd-autocomplete-dropdown [role="option"]').first().click();
      DirectoryPage.searchButton().click();

      cy.wait('@directoryEmployees').its('response.statusCode').should('eq', 200);
      DirectoryPage.recordsFound().should('be.visible');
    }, () => {
      DirectoryPage.employeeNameInput().should('not.exist');
    });
  });

  it('TC_DIRECTORY_006 - searches directory by job title when module is available', () => {
    whenDirectoryReady(() => {
      selectFirstRealOption(DirectoryPage.jobTitleDropdown());
      DirectoryPage.searchButton().click();

      cy.wait('@directoryEmployees').its('response.statusCode').should('eq', 200);
      DirectoryPage.recordsFound().should('be.visible');
    }, () => {
      DirectoryPage.searchButton().should('not.exist');
    });
  });

  it('TC_DIRECTORY_007 - searches directory by location when module is available', () => {
    whenDirectoryReady(() => {
      selectFirstRealOption(DirectoryPage.locationDropdown());
      DirectoryPage.searchButton().click();

      cy.wait('@directoryEmployees').its('response.statusCode').should('eq', 200);
      DirectoryPage.recordsFound().should('be.visible');
    }, () => {
      DirectoryPage.employeeCards().should('not.exist');
    });
  });

  it('TC_DIRECTORY_008 - resets directory filters when module is available', () => {
    whenDirectoryReady(() => {
      selectFirstRealOption(DirectoryPage.jobTitleDropdown());
      DirectoryPage.searchButton().click();
      cy.wait('@directoryEmployees');

      DirectoryPage.resetButton().click();

      cy.wait('@directoryEmployees').its('response.statusCode').should('eq', 200);
      DirectoryPage.employeeNameInput().should('have.value', '');
      DirectoryPage.jobTitleDropdown().should('contain.text', '-- Select --');
      DirectoryPage.locationDropdown().should('contain.text', '-- Select --');
    }, () => {
      cy.contains('.oxd-main-menu-item', 'Dashboard').click();

      cy.url().should('include', '/dashboard/index');
      cy.get('.oxd-topbar-header-breadcrumb-module').should('contain.text', 'Dashboard');
    });
  });
});
