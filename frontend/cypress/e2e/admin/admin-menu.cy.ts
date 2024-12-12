describe('Uses the admin page', () => {
    beforeEach(() => {
      cy.intercept('GET', '**/api/me', { fixture: 'me-admin.json' });
      cy.intercept('GET', '**/api/org/13/tree', { fixture: 'orgtree-13.json' });
      cy.intercept('GET', '**/api/org/2725/tree', { fixture: 'orgtree-2725.json' });
      cy.intercept('GET', '**/api/org/2669/tree', { fixture: 'orgtree-2669.json' });

      cy.viewport('macbook-15');
      cy.visit('http://localhost:3000/admin');
    });
  
    it('tries to use the admin page as user', () => {
        cy.intercept('GET', '**/api/me', { fixture: 'me-user.json' });
        cy.intercept('GET', '**/api/employee-checklists/employee/urb01anv', { fixture: 'employee-checklist-none.json' });
        cy.get('[data-test="nav-admin-menu"]').should("not.exist");
        cy.url().should('include', '/urb01anv')
    });

    it('uses the admin menu as admin', () => {
        cy.get('[data-test="nav-admin-menu"]').should("exist");
        cy.get('[data-test="nav-admin-menu-introduktioner"]').should('not.have.attr', 'aria-current');
        cy.get('[data-test="nav-admin-menu-mallar"]').should('have.attr', 'aria-current');
        cy.get('[data-test="nav-admin-menu-introduktioner"]').click();
        cy.url().should('not.include', '/admin');
        cy.get('[data-test="nav-admin-menu-introduktioner"]').should('have.attr', 'aria-current');
    });
  
  
  });