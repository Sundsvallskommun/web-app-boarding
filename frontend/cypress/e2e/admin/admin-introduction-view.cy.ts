import { adminOngoingIntroductions } from '../../fixtures/admin-ongoing-introductions';
import { adminemployeeIntroduction } from 'cypress/fixtures/admin-employee-introduction';
import { adminmanagedIntroductions, searchEmployeeResponse } from 'cypress/fixtures/admin-managed-introductions';

describe('Make sure to show correct introduction details', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-global-admin.json' });

    cy.intercept(
      'GET',
      '**/api/employee-checklists/ongoing?page=1&limit=15&sortBy=employeeName&sortDirection=ASC&employeeName=',
      adminOngoingIntroductions
    ).as('ongoingData');
    cy.intercept('GET', '**/api/employee-checklists/employee/man01man', adminemployeeIntroduction).as('employeeData');
    cy.intercept('GET', '**/api/employee-checklists/manager/ann01che', adminmanagedIntroductions).as('managerData');
    cy.intercept('GET', '**/api/employee-checklists/delegated-to/ann01adm', {
      fixture: 'delegated-introductions.json',
    }).as('delegatedData');
    cy.intercept('GET', '**/api/portalpersondata/**', searchEmployeeResponse);
    cy.viewport('macbook-15');
    cy.visit('http://localhost:3000/admin');
  });

  it('Go from ongoing instructions to managed instructions', () => {
    cy.get('[data-cy="ongoing-introductions-table"').should('exist');
    cy.get('[data-cy="table-row-button-0"] > [data-testid="sk-icon-arrow-right"] > .lucide').click();
    cy.get('[data-cy="admin-introduction-title"]').should('exist').contains('Introduktion för Manne Mansson');
    cy.get('[data-cy="sidebar"]').should('exist');
    cy.get('[data-cy="delegated-to-0"]').should('exist');
    cy.get('[data-cy="remove-delegation-icon"]').should('not.exist');
    cy.get('[data-cy="delegate-introduction-button"]').should('not.exist');
    cy.get('[data-cy="employee-activities"]').click();
  });
});
