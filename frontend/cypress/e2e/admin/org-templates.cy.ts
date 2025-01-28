import { searchEmployeeResponse } from 'cypress/fixtures/managed-introductions';

describe('Uses the organization templates', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-global-admin.json' });
    cy.intercept('GET', '**/api/org/13/tree', { fixture: 'orgtree-13.json' });
    cy.intercept('GET', '**/api/org/2725/tree', { fixture: 'orgtree-2725.json' });
    cy.intercept('GET', '**/api/org/2669/tree', { fixture: 'orgtree-2669.json' });
    cy.intercept('GET', '**/api/org/21/template', { statusCode: 404 });
    cy.intercept('GET', '**/api/org/13/template', { fixture: 'templates-org-13.json' });
    cy.intercept('GET', '**/api/org/2775/template', { fixture: 'templates-org-2775.json' });
    cy.intercept('GET', '**/api/org/2669/template', { fixture: 'templates-org-2669.json' });
    cy.intercept('GET', '**/api/templates/4b955690-f49d-4116-8c94-6076d93c6303', {
      fixture: 'template-4b955690.json',
    }).as('getTemplate');
    cy.intercept('GET', '**/api/portalpersondata/personal/**', searchEmployeeResponse);
    cy.viewport('macbook-15');
  });

  it('navigates to organization with multiple template versions', () => {
    cy.visit('http://localhost:3000/admin/templates');
    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="13"]').contains('Org 13').click();
    });
    cy.get('h2').should('include.text', 'Org 13');
    cy.get('[data-cy^="template-card-"]').should('have.length', 3);
    cy.get('[data-cy="template-card-00000000-f49d-4116-8c94-6076d93c6303"]').within(() => {
      cy.contains('Grund för checklista');
      cy.contains('21 Nov 2024');
      cy.contains('Utkast');
      cy.contains('Version: 3');
      cy.contains('0 aktiviteter');
    });
    cy.get('[data-cy="template-card-11111111-f49d-4116-8c94-6076d93c6303"]').within(() => {
      cy.contains('Grund för checklista');
      cy.contains('21 Nov 2024');
      cy.contains('Inaktiv');
      cy.contains('Version: 1');
      cy.contains('0 aktiviteter');
    });
    cy.get('[data-cy="template-card-4b955690-f49d-4116-8c94-6076d93c6303"]').within(($this) => {
      cy.contains('Grund för checklista');
      cy.contains('21 Nov 2024');
      cy.contains('Aktiv');
      cy.contains('Version: 2');
      cy.contains('17 aktiviteter');
      cy.wrap($this).click();
    });
    cy.wait('@getTemplate');
    cy.get('[data-cy="template-name"]').should('include.text', 'Grund för checklista');
  });

  it('navigates to organization with a single template version', () => {
    cy.visit('http://localhost:3000/admin/templates');
    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="2775"]').contains('Org 2775').click();
    });
    cy.get('h2').should('include.text', 'Org 2775');
    cy.get('[data-cy^="template-card-"]').should('have.length', 1);
    cy.get('[data-cy="template-card-4b955690-f49d-4116-8c94-6076d93c6303"]').within(() => {
      cy.contains('Grund för checklista');
      cy.contains('21 Nov 2024');
      cy.contains('Aktiv');
      cy.contains('Version: 2');
      cy.contains('17 aktiviteter');
    });
  });

  it('navigates to organization with no template', () => {
    cy.visit('http://localhost:3000/admin/templates');
    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="2669"]').contains('Org 2669').click();
    });
    cy.get('h2').should('include.text', 'Org 2669');
    cy.get('[data-cy^="template-card-"]').should('have.length', 0);
    cy.get('[data-cy="create-template-button"]').should('exist');
  });

  it('displays template sidebar correctly', () => {
    cy.intercept('POST', '**/api/org/templates', { fixture: 'sidebar-template.json' }).as('getUpperLevelTemplates');

    cy.visit('http://localhost:3000/admin/templates');
    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="2775"]').contains('Org 2775').click();
      cy.get('a[data-menuindex="13"]').contains('Org2 AO Org2').click();
    });

    cy.get('[data-cy="template-card-4b955690-f49d-4116-8c94-6076d93c6303"]').click();
    cy.wait('@getUpperLevelTemplates');

    cy.get('[data-cy="template-accordion-0"]')
      .should('exist')
      .within(() => {
        cy.get('.sk-icon .lucide-plus').should('exist').click();
        cy.get('[data-cy="template-accordion-item-0"]').should('exist').contains('Inför första dagen');
        cy.get('[data-cy="template-accordion-item-0"]').should('exist').contains('Första dagen');
        cy.get('[data-cy="template-link-0"]').should('exist').click();
        cy.wait('@getTemplate');
      });
  });
});
