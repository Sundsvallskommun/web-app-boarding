describe('Uses the template overview', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-admin.json' });
    cy.intercept('GET', '**/api/org/13/tree', { fixture: 'orgtree-13.json' });
    cy.intercept('GET', '**/api/org/2725/tree', { fixture: 'orgtree-2725.json' });
    cy.intercept('GET', '**/api/org/2669/tree', { fixture: 'orgtree-2669.json' });
    cy.intercept('GET', '**/api/org/21/template', { statusCode: 404 });
    cy.intercept('GET', '**/api/org/1/template', { fixture: 'templates-1.json' });
    cy.intercept('GET', '**/api/templates/4b955690-f49d-4116-8c94-6076d93c6303', {
      fixture: 'template-4b955690.json',
    });
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
});
