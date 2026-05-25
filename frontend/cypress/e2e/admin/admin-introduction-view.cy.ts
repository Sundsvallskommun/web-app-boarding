import { adminOngoingIntroductions } from '../../fixtures/admin-ongoing-introductions';
import { adminemployeeIntroduction, removeDelegationResponse } from 'cypress/fixtures/admin-employee-introduction';
import {
  adminmanagedIntroductions,
  delegatedIntroductionResponse,
  searchEmployeeResponse,
} from 'cypress/fixtures/admin-managed-introductions';

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
    cy.get('[data-cy="employee-activities"]').click();
  });

  it('shows delegate introduction button for admin in sidebar', () => {
    cy.get('[data-cy="table-row-button-0"] > [data-testid="sk-icon-arrow-right"] > .lucide').click();
    cy.get('[data-cy="sidebar"]').should('exist');
    cy.get('[data-cy="delegate-introduction-button"]').should('exist');
    cy.get('[data-cy="remove-delegation-icon-0"]').should('exist');
  });

  it('admin can delegate introduction from sidebar', () => {
    cy.intercept('GET', '**/api/portalpersondata/personal/**', searchEmployeeResponse).as('searchEmployee');
    cy.intercept('POST', '**/api/employee-checklists/**/delegate-to/**', delegatedIntroductionResponse).as(
      'delegateChecklist'
    );

    cy.get('[data-cy="table-row-button-0"] > [data-testid="sk-icon-arrow-right"] > .lucide').click();
    cy.get('[data-cy="sidebar"]').should('exist');

    cy.get('[data-cy="delegate-introduction-button"]').should('exist').click();

    cy.get('[data-cy="search-employee-input"]').should('exist').type('anv01anv');
    cy.get('button').contains('Sök').click();
    cy.wait('@searchEmployee');
    cy.get('[data-cy="search-result-card"]').should('exist').contains('Användare Användarsson');
    cy.get('[data-cy="add-search-result-button"]').should('have.text', 'Lägg till').should('exist').click();

    cy.get('[data-cy="assign-delegations-button"]')
      .should('exist')
      .should('have.text', 'Tilldela')
      .click({ force: true });

    cy.wait('@delegateChecklist');
    cy.get('[data-cy="search-employee-input"]').should('not.exist');
  });

  it('keeps the introduction visible after opening and closing the delegate modal without assigning', () => {
    cy.get('[data-cy="table-row-button-0"] > [data-testid="sk-icon-arrow-right"] > .lucide').click();
    cy.get('[data-cy="admin-introduction-title"]').should('contain', 'Introduktion för Manne Mansson');

    cy.get('[data-cy="delegate-introduction-button"]').should('exist').click();
    cy.get('[data-cy="search-employee-input"]').should('exist');
    cy.get('button').contains('Avbryt').click();

    cy.get('[data-cy="search-employee-input"]').should('not.exist');
    cy.get('[data-cy="admin-introduction-title"]').should('contain', 'Introduktion för Manne Mansson');
    cy.contains('Du har ingen pågående introduktion').should('not.exist');
  });

  it('admin can remove existing delegation from sidebar', () => {
    cy.intercept('DELETE', '**/api/employee-checklists/**/delegated-to/**', removeDelegationResponse).as(
      'removeDelegation'
    );

    cy.get('[data-cy="table-row-button-0"] > [data-testid="sk-icon-arrow-right"] > .lucide').click();
    cy.get('[data-cy="sidebar"]').should('exist');

    cy.get('[data-cy="remove-delegation-icon-0"]').should('exist').click();
    cy.get('button').contains('Ta bort').should('have.css', 'color', 'rgb(255, 255, 255)').click();
    cy.wait('@removeDelegation');
  });
});
