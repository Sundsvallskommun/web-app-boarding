describe('Uses the organization tree', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-global-admin.json' });
    cy.intercept('GET', '**/api/org/13/tree', { fixture: 'orgtree-13.json' });
    cy.intercept('GET', '**/api/org/2725/tree', { fixture: 'orgtree-2725.json' });
    cy.intercept('GET', '**/api/org/2669/tree', { fixture: 'orgtree-2669.json' });
    cy.intercept('GET', '**/api/org/21/template', { statusCode: 404 });
    cy.intercept('GET', '**/api/org/24/template', { statusCode: 404 });

    cy.intercept('GET', '**/api/org/2668/tree', { body: {} });
    cy.intercept('GET', '**/api/org/2744/tree', { body: {} });
    cy.intercept('GET', '**/api/org/2754/tree', { body: {} });
    cy.intercept('GET', '**/api/org/2755/tree', { body: {} });
    cy.intercept('GET', '**/api/org/2764/tree', { body: {} });

    cy.viewport('macbook-15');
  });

  it('uses the org tree navigation', () => {
    cy.visit('http://localhost:3000/admin/templates');
    cy.intercept('GET', '**/api/org/13/template', { body: {} });

    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="23"]').should('not.be.visible');
      cy.get('a[data-menuindex="13"]').click();
      cy.get('a[data-menuindex="23"]').should('be.visible');
    });
  });

  it('enters on an organization page', () => {
    cy.visit('http://localhost:3000/admin/templates/24');
    cy.intercept('GET', '**/api/org/24/template', { body: {} });

    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="24"]').should('be.visible');
      cy.get('a[data-menuindex="24"]').should('have.attr', 'aria-current').and('eq', 'page');
      cy.get('a[data-menuindex="24"]').should('have.attr', 'aria-expanded').and('eq', 'true');
      cy.get('a[data-menuindex="24"]').should('have.attr', 'aria-haspopup').and('eq', 'true');
    });
  });

  it('filters the organization tree', () => {
    cy.visit('http://localhost:3000/admin/templates');
    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="13"]').should('be.visible');
      cy.get('a[data-menuindex="2669"]').should('be.visible');
      cy.get('a[data-menuindex="2775"]').should('be.visible');
    });
    cy.get('[data-cy="orgtree-filter"]').type('org2');
    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="13"]').should('not.exist');
      cy.get('a[data-menuindex="2775"]').should('be.visible');
      cy.get('a[data-menuindex="2669"]').should('not.exist');
    });
    cy.get('[data-cy="orgtree-filter"]').clear().type('företagsälj');
    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="2775"]').next().click();
      cy.get('a[data-menuindex="2669"]').next().click();
      cy.get('a[data-menuindex="3"]').should('be.visible');
    });
  });
});
