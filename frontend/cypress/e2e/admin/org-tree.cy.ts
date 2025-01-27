describe('Uses the organization tree', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-global-admin.json' });
    cy.intercept('GET', '**/api/org/13/tree', { fixture: 'orgtree-13.json' });
    cy.intercept('GET', '**/api/org/2725/tree', { fixture: 'orgtree-2725.json' });
    cy.intercept('GET', '**/api/org/2669/tree', { fixture: 'orgtree-2669.json' });
    cy.intercept('GET', '**/api/org/21/template', { statusCode: 404 });
    cy.intercept('GET', '**/api/org/24/template', { statusCode: 404 });
    cy.viewport('macbook-15');
  });

  it('uses the org tree navigation', () => {
    cy.visit('http://localhost:3000/admin/templates');
    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="23"]').should('not.be.visible');
      cy.get('a[data-menuindex="21"]').click();
      cy.get('a[data-menuindex="23"]').should('be.visible');
    });
  });

  it('enters on an organization page', () => {
    cy.visit('http://localhost:3000/admin/templates/24');
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
      cy.get('a[data-menuindex="1"]').should('be.visible');
      cy.get('a[data-menuindex="11"]').should('be.visible');
      cy.get('a[data-menuindex="21"]').should('be.visible');
    });
    cy.get('[data-cy="orgtree-filter"]').type('org2');
    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="1"]').should('not.exist');
      cy.get('a[data-menuindex="11"]').should('be.visible');
      cy.get('a[data-menuindex="21"]').should('not.exist');
    });
    cy.get('[data-cy="orgtree-filter"]').clear().type('företagsälj');
    cy.get('[data-cy="organization-tree"]').within(() => {
      cy.get('a[data-menuindex="21"]').next().click();
      cy.get('a[data-menuindex="23"]').next().click();
      cy.get('a[data-menuindex="210"]').should('be.visible');
    });
  });
});
