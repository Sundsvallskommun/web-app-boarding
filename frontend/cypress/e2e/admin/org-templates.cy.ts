describe('Uses the organization templates', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-admin.json' });
    cy.intercept('GET', '**/api/org/13/tree', { fixture: 'orgtree-13.json' });
    cy.intercept('GET', '**/api/org/2725/tree', { fixture: 'orgtree-2725.json' });
    cy.intercept('GET', '**/api/org/2669/tree', { fixture: 'orgtree-2669.json' });
    cy.intercept('GET', '**/api/org/21/template', { statusCode: 404 });
    cy.intercept('GET', '**/api/org/1/template', { fixture: 'templates-1.json' });
    cy.viewport('macbook-15');
  });

  it('uses the org tree navigation', () => {
    cy.visit('http://localhost:3000/admin/templates');
    cy.get('[data-test="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="1"]').click();
    });
    cy.get('h2').should('include.text', 'Org1');
    cy.get('[data-test="template-card-1"]').within(($this) => {
      cy.contains('Grund för checklista');
      cy.contains('21 Nov 2024');
      cy.contains('9 aktiviteter');
      cy.wrap($this).click();
    });
  });
});
