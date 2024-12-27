import { searchEmployeeResponse } from 'cypress/fixtures/managed-introductions';

describe('Uses the template overview', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-admin.json' });
    cy.intercept('GET', '**/api/portalpersondata/personal/**', searchEmployeeResponse);
    cy.intercept('GET', '**/api/org/13/tree', { fixture: 'orgtree-13.json' });
    cy.intercept('GET', '**/api/org/2725/tree', { fixture: 'orgtree-2725.json' });
    cy.intercept('GET', '**/api/org/2669/tree', { fixture: 'orgtree-2669.json' });
    cy.intercept('GET', '**/api/org/21/template', { statusCode: 404 });
    cy.intercept('GET', '**/api/org/1/template', { fixture: 'templates-1.json' });
    cy.intercept('GET', '**/api/templates/4b955690-f49d-4116-8c94-6076d93c6303', {
      fixture: 'template-4b955690.json',
    });
    cy.intercept(
      'PATCH',
      '**/api/templates/4b955690-f49d-4116-8c94-6076d93c6303/phases/e819872c-84d2-4468-b5c5-dd862c0df1c4/tasks/da59bbfa-f064-4f34-8f61-76647fec3852',
      {}
    ).as('updateTask');
    cy.viewport('macbook-15');
  });

  it('uses the template view', () => {
    cy.visit('http://localhost:3000/admin/templates/13/4b955690-f49d-4116-8c94-6076d93c6303');
    cy.get('h2').should('include.text', 'Grund för checklista');
    cy.get('[data-cy="template-menu-bar-item-0"]').within(() => {
      cy.contains('Chef').click();
    });
    cy.get('[data-cy="phase-section-0"]').should('exist');
    cy.get('[data-cy="phase-section-0"]').within(() => {
      cy.get('[data-cy="add-activity-button"]').should('exist');
      cy.get('[data-cy="task-heading"]')
        .contains('Du som chef ansvarar för introduktionen för din nya medarbetare')
        .should('exist');
      cy.get('[data-cy="task-text"]')
        .contains('Vid behov kan du utse någon annan, exempelvis en fadder, för planering av delar i introduktionen.')
        .should('exist');
    });

    cy.get('[data-cy="template-menu-bar-item-1"]').within(() => {
      cy.contains('Anställd').click();
    });
    cy.get('[data-cy="phase-section-0"]').should('exist');
    cy.get('[data-cy="phase-section-1"]').should('exist');
    cy.get('[data-cy="phase-section-1"]').within(() => {
      cy.get('[data-cy="add-activity-button"]').should('exist');
      cy.get('[data-cy="task-heading"]').contains('Den anställdes första dag').should('exist');
      cy.get('[data-cy="task-text"]').contains('Den anställdes första dag beskrivs här.').should('exist');
    });
  });

  it('allows editing task', () => {
    cy.visit('http://localhost:3000/admin/templates/13/4b955690-f49d-4116-8c94-6076d93c6303');
    cy.get('h2').should('include.text', 'Grund för checklista');
    cy.get('[data-cy="template-menu-bar-item-0"]').within(() => {
      cy.contains('Chef').click();
    });
    cy.get('[data-cy="phase-section-0"]')
      .should('exist')
      .within(() => {
        cy.get('[data-cy="activity-list-item-0"]')
          .should('exist')
          .within(() => {
            cy.get('[data-cy="task-menu-button"]').should('exist').click();
            cy.get('[data-cy="activity-edit-button"]').should('exist').click();
          });
      });
    cy.get('[data-cy="edit-task-modal"]')
      .should('exist')
      .within(() => {
        cy.get('[data-cy="role-type-radio-button"][value="NEW_MANAGER"]').should('exist').click();
        cy.get('[data-cy="activity-heading-input"]').should('exist').clear().type('Updated heading');
        cy.get('[data-cy="activity-heading-reference-input"]').should('exist').clear().type('https://example.com');
        cy.get('[data-cy="activity-description"]').should('exist').clear().type('Updated text');
        cy.get('[data-cy="activity-save-button"]').should('exist').click();
      });
    cy.wait('@updateTask').should(({ request }) => {
      expect(request.body.roleType).to.equal('NEW_MANAGER');
      expect(request.body.heading).to.equal('Updated heading');
      expect(request.body.headingReference).to.equal('https://example.com');
      expect(request.body.text).to.equal('<p>Updated text</p>');
    });
  });

  it('allows removing task', () => {
    cy.intercept(
      'DELETE',
      '**/api/templates/4b955690-f49d-4116-8c94-6076d93c6303/phases/e819872c-84d2-4468-b5c5-dd862c0df1c4/tasks/da59bbfa-f064-4f34-8f61-76647fec3852',
      {}
    ).as('removeTask');

    cy.visit('http://localhost:3000/admin/templates/13/4b955690-f49d-4116-8c94-6076d93c6303');
    cy.get('h2').should('include.text', 'Grund för checklista');
    cy.get('[data-cy="template-menu-bar-item-0"]').within(() => {
      cy.contains('Chef').click();
    });
    cy.get('[data-cy="phase-section-0"]')
      .should('exist')
      .within(() => {
        cy.get('[data-cy="activity-list-item-0"]')
          .should('exist')
          .within(() => {
            cy.get('[data-cy="task-menu-button"]').should('exist').click();
            cy.get('[data-cy="activity-remove-button"]').should('exist').click();
          });
      });
    cy.wait('@removeTask').should(({ request }) => {
      expect(request.method).to.equal('DELETE');
    });
  });
});
