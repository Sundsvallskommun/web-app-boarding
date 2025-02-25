import { searchEmployeeResponse } from 'cypress/fixtures/managed-introductions';

describe('Uses the organization templates', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/org/13/tree', { fixture: 'orgtree-13.json' });

    cy.intercept('GET', '**/api/org/2668/tree', { body: {} });
    cy.intercept('GET', '**/api/org/2744/tree', { body: {} });
    cy.intercept('GET', '**/api/org/2754/tree', { body: {} });
    cy.intercept('GET', '**/api/org/2755/tree', { body: {} });
    cy.intercept('GET', '**/api/org/2764/tree', { body: {} });

    cy.intercept('GET', '**/api/org/2725/tree', { fixture: 'orgtree-2725.json' });
    cy.intercept('GET', '**/api/org/2669/tree', { fixture: 'orgtree-2669.json' });
    cy.intercept('GET', '**/api/org/21/template', { statusCode: 404 });
    cy.intercept('GET', '**/api/org/13/template', { fixture: 'templates-org-13.json' });
    cy.intercept('GET', '**/api/org/23/template', { fixture: 'templates-org-23.json' });
    cy.intercept('GET', '**/api/org/2775/template', { fixture: 'templates-org-2775.json' });
    cy.intercept('GET', '**/api/org/2669/template', { fixture: 'templates-org-2669.json' });
    cy.intercept('GET', '**/api/templates/4b955690-f49d-4116-8c94-6076d93c6303', {
      fixture: 'template-4b955690.json',
    }).as('getTemplate');
    cy.intercept('POST', '**/api/org/multiple/templates', {
      fixture: 'templates-empty.json',
    });
    cy.intercept('GET', '**/api/portalpersondata/personal/**', searchEmployeeResponse);
    cy.intercept(
      'DELETE',
      '**/api/org/13/templates/4b955690-f49d-4116-8c94-6076d93c6303/phases/e819872c-84d2-4468-b5c5-dd862c0df1c4/tasks/da59bbfa-f064-4f34-8f61-76647fec3852',
      { statusCode: 204 }
    ).as('deleteTask');
    cy.intercept(
      'PATCH',
      '**/api/org/13/templates/4b955690-f49d-4116-8c94-6076d93c6303/phases/e819872c-84d2-4468-b5c5-dd862c0df1c4/tasks/da59bbfa-f064-4f34-8f61-76647fec3852',
      { statusCode: 204 }
    ).as('editTask');
    cy.viewport('macbook-15');
  });

  it('allows global admin to create templates', () => {
    cy.visit('http://localhost:3000/admin/templates');
    cy.intercept('GET', '**/api/me', { fixture: 'me-global-admin.json' });
    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="2669"]').contains('Org 2669').click();
    });
    cy.get('h2').should('include.text', 'Org 2669');
    cy.contains('Det finns ingen mall för Org 2669').should('exist');
    cy.get('[data-cy="create-template-button"]').should('exist');
  });

  it('allows department admin to create templates on their own organization', () => {
    cy.visit('http://localhost:3000/admin/templates');
    cy.intercept('GET', '**/api/me', { fixture: 'me-department-admin.json' });

    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="13"]').contains('Org 13').click();
      cy.get('a[data-menuindex="23"]').contains('Org3 AO Org3').click();
    });
    cy.get('h2').should('include.text', 'Org3 AO Org3');
    cy.contains('Det finns ingen mall för Org3 AO Org3').should('exist');
    cy.get('[data-cy="create-template-button"]').should('exist');
  });

  it('does NOT allow department admin to create templates on another organization', () => {
    cy.visit('http://localhost:3000/admin/templates');
    cy.intercept('GET', '**/api/me', { fixture: 'me-department-admin.json' });

    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="2669"]').contains('Org 2669').click();
    });
    cy.get('h2').should('include.text', 'Org 2669');
    cy.contains('Det finns ingen mall för Org 2669').should('exist');
    cy.get('[data-cy="create-template-button"]').should('not.exist');
  });

  it('allows global admin to edit activities on any template', () => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-global-admin.json' });
    cy.intercept('GET', '**/api/templates/4b955690-f49d-4116-8c94-6076d93c6303/events', { body: {} });
    cy.visit('http://localhost:3000/admin/templates/13/4b955690-f49d-4116-8c94-6076d93c6303');

    // Remove one activity
    cy.get('[data-cy="phase-section-0"]')
      .first()
      .within(() => {
        cy.get('[data-cy="add-activity-button"]').should('exist');
        cy.get('[data-cy="activity-list-item-0"]')
          .first()
          .each(() => {
            cy.get('[data-cy="task-menu-button"]').should('exist').click({ multiple: true });
            cy.get('[data-cy="activity-0-remove-button"]').should('exist').contains('Ta bort').click({ force: true });
          });
      });
    cy.get('.sk-modal-wrapper').each(() => {
      cy.get('h1').contains('Ta bort aktivitet?').should('exist');
      cy.get('button').contains('Avbryt').should('exist');
      cy.get('button').contains('Ta bort').should('exist');
      cy.get('[data-color="error"]').contains('Ta bort').click({ force: true });
      cy.wait('@deleteTask').should(({ request }) => {
        expect(request.url).to.contain('da59bbfa-f064-4f34-8f61-76647fec3852');
      });
    });

    // Edit one activity
    cy.get('[data-cy="phase-section-0"]')
      .first()
      .each(() => {
        cy.get('[data-cy="activity-list-item-0"]')
          .first()
          .within(() => {
            cy.get('[data-cy="task-menu-button"]').should('exist').click();
            cy.get('[data-cy="activity-edit-button"]').should('exist').click();
          });
      });

    cy.get('.sk-modal-wrapper').within(() => {
      cy.get('h4').contains('Redigera aktivitet').should('exist');
      cy.get('button').contains('Avbryt').should('exist');
      cy.get('button').contains('Spara').should('exist');
      cy.get('button').contains('Spara').click();
      cy.wait('@editTask').should(({ request }) => {
        expect(request.body.heading).to.equal('Du som chef ansvarar för introduktionen för din nya medarbetare');
        expect(request.body.text).to.equal(
          '<p>Vid behov kan du utse någon annan, exempelvis en fadder, för planering av delar i introduktionen.</p>'
        );
        expect(request.body.updatedBy).to.equal('ann01adm');
      });
    });
  });

  it('does NOT allow department admin to edit activities on any template', () => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-department-admin.json' });
    cy.visit('http://localhost:3000/admin/templates/13/4b955690-f49d-4116-8c94-6076d93c6303');
    cy.intercept('GET', '**/api/templates/4b955690-f49d-4116-8c94-6076d93c6303/events', { body: {} });

    // Editing and removing activities should not be possible
    cy.get('[data-cy="phase-section-0"]').each(() => {
      cy.get('[data-cy="add-activity-button"]').should('not.exist');
      cy.get('[data-cy="activity-list-item-0"]').each(() => {
        cy.get('[data-cy="task-menu-button"]').should('not.exist');
      });
    });
  });
});
