import { searchEmployeeResponse } from 'cypress/fixtures/admin-managed-introductions';
import { adminOngoingIntroductions } from 'cypress/fixtures/admin-ongoing-introductions';

describe('Testing admin template history', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-global-admin.json' });
    cy.intercept(
      'GET',
      '**/api/employee-checklists/ongoing?page=1&limit=15&sortBy=employeeName&sortDirection=ASC&employeeName=',
      adminOngoingIntroductions
    );

    cy.intercept('GET', '**/api/org/2668/tree', { body: {} });
    cy.intercept('GET', '**/api/org/2744/tree', { body: {} });
    cy.intercept('GET', '**/api/org/2754/tree', { body: {} });
    cy.intercept('GET', '**/api/org/2755/tree', { body: {} });
    cy.intercept('GET', '**/api/org/2764/tree', { body: {} });

    cy.intercept('GET', '**/api/portalpersondata/personal/**', searchEmployeeResponse);
    cy.intercept('GET', '**/api/org/13/tree', { fixture: 'orgtree-13.json' });
    cy.intercept('GET', '**/api/org/2725/tree', { fixture: 'orgtree-2725.json' });
    cy.intercept('GET', '**/api/org/2669/tree', { fixture: 'orgtree-2669.json' });
    cy.intercept('GET', '**/api/org/21/template', { statusCode: 404 });
    cy.intercept('GET', '**/api/org/1/template', { fixture: 'templates-org-13.json' });
    cy.intercept('GET', '**/api/org/13/template', { fixture: 'templates-org-13.json' });
    cy.intercept('GET', '**/api/org/23/template', { fixture: 'templates-org-23.json' });
    cy.intercept('GET', '**/api/org/24/template');
    cy.intercept('GET', '**/api/templates/d13d0582-0eb4-47f4-9133-47e08a2bb8c3', { fixture: 'template-4b955690.json' });
    cy.intercept('POST', '**/api/org/multiple/templates', { fixture: 'templates-empty.json' }).as('postTemplates');
    cy.intercept('GET', '**/api/templates/d13d0582-0eb4-47f4-9133-47e08a2bb8c3/events', { fixture: 'events.json' }).as(
      'eventsData'
    );

    cy.viewport('macbook-15');
    cy.visit('http://localhost:3000/admin');
  });

  it('should show admin template history', () => {
    cy.visit('http://localhost:3000/admin/templates/13/d13d0582-0eb4-47f4-9133-47e08a2bb8c3');
    cy.get('[data-cy="history-button"]').click();
    cy.wait('@eventsData');

    cy.get('[data-cy^="history-event-"]').each(($el, index) => {
      cy.fixture('events.json').then((events) => {
        const event = events.data.eventList[index];
        cy.wrap($el).within(() => {
          cy.get('p').should('contain', event.message);
          cy.get('p').should('contain', event.metadata[0].value);
        });
      });
    });
  });
});
