import { managerAsEmployeeIntroduction } from '../../fixtures/manager-as-employee-introduction';
import { emptyDelegatedIntroductions, emptyManagedIntroductions } from '../../fixtures/empty-introductions';
import {
  delegatedIntroductionResponse,
  managedIntroductions,
  searchEmployeeResponse,
} from '../../fixtures/managed-introductions';

describe('Overview as user', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-manager.json' });
    cy.intercept('GET', '**/api/portalpersondata/personal/**', searchEmployeeResponse).as('searchEmployee');
    cy.viewport('macbook-15');
    cy.visit('http://localhost:3000/');
  });

  it('as manager with introduction, employee introductions and delegated introductions', () => {
    cy.intercept('GET', '**/api/employee-checklists/manager/ann01che', managedIntroductions);
    cy.intercept('GET', '**/api/employee-checklists/employee/ann01che', managerAsEmployeeIntroduction);
    cy.intercept('GET', '**/api/employee-checklists/delegated-to/ann01che', {
      fixture: 'delegated-introductions.json',
    });

    cy.get('[data-cy="employee-checklist-card"]').should('exist');
    cy.get('[data-cy="managed-checklists-table"]').should('exist');
    cy.get('[data-cy="delegated-checklists-table"]').should('exist');
  });

  it('as employee', () => {
    cy.intercept('GET', '**/api/employee-checklists/manager/ann01che', emptyManagedIntroductions);
    cy.intercept('GET', '**/api/employee-checklists/employee/ann01che', managerAsEmployeeIntroduction);
    cy.intercept('GET', '**/api/employee-checklists/delegated-to/ann01che', emptyDelegatedIntroductions);

    cy.get('[data-cy="employee-checklist-card"]').should('exist');
    cy.get('[data-cy="managed-checklists-table"]').should('not.exist');
    cy.get('[data-cy="delegated-checklists-table"]').should('not.exist');
  });

  it('as manager with delegated introductions', () => {
    cy.intercept('GET', '**/api/employee-checklists/manager/ann01che', emptyManagedIntroductions);
    cy.intercept('GET', '**/api/employee-checklists/employee/ann01che', { fixture: 'employee-checklist-none.json' });
    cy.intercept('GET', '**/api/employee-checklists/delegated-to/ann01che', {
      fixture: 'delegated-introductions.json',
    });
  });

  it('as manager without any introductions', () => {
    cy.intercept('GET', '**/api/employee-checklists/manager/ann01che', emptyManagedIntroductions);
    cy.intercept('GET', '**/api/employee-checklists/employee/ann01che', { fixture: 'employee-checklist-none.json' });
    cy.intercept('GET', '**/api/employee-checklists/delegated-to/ann01che', emptyDelegatedIntroductions);

    cy.get('[data-cy="employee-checklist-card"]').should('not.exist');
    cy.get('[data-cy="managed-checklists-table"]').should('not.exist');
    cy.get('[data-cy="delegated-checklists-table"]').should('not.exist');
  });

  it('delegates multiple introductions', () => {
    cy.intercept('GET', '**/api/employee-checklists/manager/ann01che', managedIntroductions);
    cy.intercept('GET', '**/api/employee-checklists/employee/ann01che', { fixture: 'employee-checklist-none.json' });
    cy.intercept('GET', '**/api/employee-checklists/delegated-to/ann01che', emptyDelegatedIntroductions);

    cy.get('[data-cy="managed-checklists-table"]').should('exist');
    managedIntroductions.data.map((employeeIntroduction) => {
      cy.get(`[data-cy="delegation-checkbox-${employeeIntroduction.id}"]`).should('exist').check({ force: true });
    });

    cy.get('[data-cy="delegation-popup"]').should('exist');
    cy.get('[data-cy="delegation-popup-introductions-count"]')
      .should('exist')
      .contains(`${managedIntroductions.data.length} anställda valda`);

    cy.get('[data-cy="uncheck-all-introductions"]').should('exist').click();
    cy.get('[data-cy="delegation-popup-introductions-count"]').should('not.exist');

    cy.get('[data-cy="check-all-introductions"]').should('exist').check({ force: true });
    cy.get('[data-cy="delegate-multiple-introductions"]').should('exist').click();

    cy.get('[data-cy="search-employee-input"]').should('exist').type('anv01anv');
    cy.get('button').contains('Sök').click();
    cy.wait('@searchEmployee');
    cy.get('[data-cy="search-result-card"]').should('exist').contains('Användare Användarsson');
    cy.get('[data-cy="add-search-result-button"]').contains('Lägg till').should('exist').click();
    cy.get('[data-cy="remove-selected-user-button"]').should('exist').click();

    cy.get('[data-cy="search-employee-input"]').should('exist').type('anv01anv');
    cy.get('button').contains('Sök').click();
    cy.wait('@searchEmployee');
    cy.get('[data-cy="add-search-result-button"]').should('exist').contains('Lägg till').click();
    cy.intercept('POST', '**/api/employee-checklists/**/delegate-to/**', delegatedIntroductionResponse);
    cy.get('[data-cy="assign-delegations-button"]')
      .should('exist')
      .should('have.text', 'Tilldela')
      .click({ force: true });

    cy.get('[data-cy="search-employee-input"]').should('not.exist');
  });
});
