describe('Overview as user', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-admin.json' });

    cy.viewport('macbook-15');
    cy.visit('http://localhost:3000/');
  });

  it.only('as manager', () => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-manager.json' });
    cy.intercept('GET', '**/api/employee-checklists/manager/ann01che', { fixture: 'managed-checklists.json' });
    cy.intercept('GET', '**/api/employee-checklists/employee/ann01che', { fixture: 'employee-checklist-none.json' });
    cy.intercept('GET', '**/api/employee-checklists/delegated-to/ann01che', {
      fixture: 'employee-checklist-none.json',
    });
  });

  it('as employee with delegated introductions', () => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-user.json' });
  });

  it('as employee', () => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-user.json' });
  });

  it('as employee without checklists', () => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-user.json' });
  });
});
