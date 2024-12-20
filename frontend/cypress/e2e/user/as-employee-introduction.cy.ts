import { emptyDelegatedIntroductions } from '../../fixtures/empty-introductions';
import { managerAsEmployeeIntroduction } from '../../fixtures/manager-as-employee-introduction';

describe('Employee introduction as employee', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-manager.json' });
    cy.intercept('GET', '**/api/employee-checklists/manager/ann01che', { fixture: 'managed-introductions.ts' });
    cy.intercept('GET', '**/api/employee-checklists/employee/ann01che', managerAsEmployeeIntroduction);
    cy.intercept('GET', '**/api/employee-checklists/delegated-to/ann01che', emptyDelegatedIntroductions);

    cy.viewport('macbook-15');
    cy.visit('http://localhost:3000');
    cy.get('[data-cy="user-introduction"]').should('exist');
    cy.get('[data-cy="user-introduction-button"]').should('exist').click();
    cy.get('h1').should('exist').contains('Introduktion för Anna Chef');
  });

  it('shows introduction page correctly', () => {
    cy.get('[data-cy="radio-button-group"]').should('not.exist');
    cy.get('[data-cy="radio-button-manager-view"]').should('not.exist');
    cy.get('[data-cy="add-activity-button"]').should('not.exist');

    cy.get('[data-cy="sidebar"]').should('exist').contains(managerAsEmployeeIntroduction.data.employee.username);
    cy.get('[data-cy="sidebar"]').should('exist').contains(managerAsEmployeeIntroduction.data.employee.email);
    cy.get('[data-cy="sidebar"]').should('exist').contains(managerAsEmployeeIntroduction.data.startDate);
    cy.get('[data-cy="mentor-content"]').should('exist').contains('Det finns ingen tillagd mentor');
    cy.get('[data-cy="delegated-to-content"]').should('not.exist');
  });

  it('views phases and marks activities as done', () => {
    cy.get('[data-cy="phase-menu-bar"]').contains('Om din anställning');
    cy.get('[data-cy="phase-menu-bar-button"]').contains('Nyanställd chef').should('exist').click();

    managerAsEmployeeIntroduction.data.phases[1].tasks.map((task) => {
      const updateFulfilmentStatusResponse = {
        id: task.id,
        heading: task.heading,
        text: task.text,
        sortOrder: 0,
        roleType: task.roleType,
        customTask: task.customTask,
        responseText: '',
        updated: '2024-12-27T12:30:00Z',
        fulfilmentStatus: 'TRUE',
        updatedBy: 'ann01che',
      };
      cy.intercept('PATCH', '**/api/employee-checklists/**/tasks/**', updateFulfilmentStatusResponse);
    });
    cy.get('[data-cy="complete-all-activities"]').should('exist').check({ force: true });
  });
});
