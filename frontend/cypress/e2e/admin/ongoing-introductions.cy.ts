import {
  adminOngoingIntroductions,
  adminOngoingIntroductionsSearchResponse,
} from '../../fixtures/admin-ongoing-introductions';

describe('Uses ongoing introductions', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-admin.json' });
    cy.intercept('GET', '**/api/employee-checklists/ongoing*', adminOngoingIntroductions);

    cy.viewport('macbook-15');
    cy.visit('http://localhost:3000/admin');
  });

  it('views ongoing introductions table correctly', () => {
    cy.get('[data-cy="ongoing-introductions-table-search-field"]').should('exist');
    cy.get('[data-cy="ongoing-introductions-count"]')
      .should('exist')
      .contains(adminOngoingIntroductions.data._meta.count);
    cy.get('[data-cy="ongoing-introductions-table"]').should('exist');
    cy.get('[data-cy="ongoing-introductions-table-header"]').should('exist');
    cy.get('[data-cy="ongoing-introductions-table-footer"]').should('not.exist');
  });

  it.only('can search for employee', () => {
    cy.intercept(
      'GET',
      '**/api/employee-checklists/ongoing?page=1&limit=15&employeeName=Two',
      adminOngoingIntroductionsSearchResponse
    );
    cy.get('[data-cy="ongoing-introductions-table"]').should('exist');
    cy.get('[data-cy="ongoing-introductions-table-search-field"]').should('exist').type('Two');
    cy.get('button').should('exist').contains('Sök').click();

    cy.get('[data-cy="ongoing-introductions-count"]')
      .should('exist')
      .contains(adminOngoingIntroductionsSearchResponse.data._meta.count);

    cy.get('[data-cy="ongoing-introductions-table"]')
      .should('exist')
      .contains(adminOngoingIntroductionsSearchResponse.data.checklists[0].employeeName);
  });
});
