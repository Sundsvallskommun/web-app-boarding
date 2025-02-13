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
    cy.intercept('GET', '**/api/org/27752/template', { fixture: 'templates-org-2775.json' });
    cy.intercept('GET', '**/api/org/2669/template', { fixture: 'templates-org-2669.json' });
    cy.intercept('GET', '**/api/templates/4b955690-f49d-4116-8c94-6076d93c6303', {
      fixture: 'template-4b955690.json',
    }).as('getTemplate');
    cy.intercept('GET', '**/api/portalpersondata/personal/**', searchEmployeeResponse);
    cy.viewport('macbook-15');
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
    });
    cy.get('[data-cy="communication-channel-switch"]').should('exist');
  });

  it('navigates to organization with no template', () => {
    cy.visit('http://localhost:3000/admin/templates');
    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="2669"]').contains('Org 2669').click();
    });
    cy.get('h2').should('include.text', 'Org 2669');
    cy.get('[data-cy^="template-card-"]').should('have.length', 0);
    cy.get('[data-cy="create-template-button"]').should('exist');
    cy.get('[data-cy="communication-channel-switch"]').should('not.exist');
  });

  it('can activate template', () => {
    cy.intercept('GET', '**/api/org/2669', { fixture: 'templates-org-2669.json' }).as('getOrgTemplate');
    cy.intercept('POST', '**/api/org/2669', { fixture: 'templates-org-2669.json' }).as('postOrgTemplate');
    cy.intercept('POST', '**/api/org/2669/templates', { fixture: 'templates-org-2669.json' }).as('postOrgTemplates');
    cy.intercept('GET', '**/api/templates/1', {
      fixture: 'template-4b955690.json',
    });

    cy.intercept('GET', '**/api/templates/1/events', { fixture: null });
    cy.intercept('POST', '**/api/org/multiple/templates', { fixture: null });

    cy.visit('http://localhost:3000/admin/templates');
    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="2669"]').contains('Org 2669').click();
    });
    cy.get('h2').should('include.text', 'Org 2669');
    cy.get('[data-cy^="template-card-"]').should('have.length', 0);
    cy.get('[data-cy="create-template-button"]').should('exist');
    cy.get('[data-cy="communication-channel-switch"]').should('not.exist');

    cy.get('[data-cy="create-template-button"]').should('exist').click();
    cy.get('[data-color="gronsta"]').should('have.text', 'Skapa').click();

    cy.wait('@getOrgTemplate');
    cy.wait('@postOrgTemplate');
    cy.wait('@postOrgTemplates');
  });

  it('can toggle communication channel', () => {
    cy.intercept('PATCH', '**/api/org/1', { fixture: 'templates-org-2669.json' }).as('patchOrganization');
    cy.visit('http://localhost:3000/admin/templates');
    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="2775"]').contains('Org 2775').click();
    });
    cy.get('h2').should('include.text', 'Org 2775');
    cy.get('[data-cy^="template-card-"]').should('have.length', 1);
    cy.get('[data-cy="template-card-4b955690-f49d-4116-8c94-6076d93c6303"]').within(() => {
      cy.contains('Aktiv');
    });

    cy.get('[data-cy="communication-channel-switch"]').should('exist').click({ force: true });
    cy.wait('@patchOrganization');

    cy.get('.sk-snackbar-content').should('exist').contains('Mailutskick aktiverades för Org 2775');
  });

  it('displays template sidebar correctly', () => {
    cy.intercept('POST', '**/api/org/multiple/templates', { fixture: 'sidebar-template.json' }).as(
      'getUpperLevelTemplates'
    );
    cy.intercept('GET', '**/api/templates/4b955690-f49d-4116-8c94-6076d93c6303/events', { fixture: null });

    cy.visit('http://localhost:3000/admin/templates');
    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="2775"]').contains('Org 2775').click();
      cy.get('a[data-menuindex="27752"]').contains('Org2 AO Org2').click();
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

        cy.intercept('GET', '**/api/templates/111-111-111-111-111', { fixture: 'template-4b955690.json' });
        cy.intercept('GET', '**/api/templates/111-111-111-111-111/events', { fixture: null });
      });
  });
});
