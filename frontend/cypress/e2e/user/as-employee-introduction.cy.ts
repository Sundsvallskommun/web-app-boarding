import { emptyDelegatedIntroductions } from '../../fixtures/empty-introductions';
import { managerAsEmployeeIntroduction } from '../../fixtures/manager-as-employee-introduction';

describe('Employee introduction as employee', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-manager.json' });
    cy.intercept('GET', '**/api/employee-checklists/manager/ann01che', { fixture: 'managed-introductions.ts' });
    cy.intercept('GET', '**/api/employee-checklists/manager/bob01bos', { fixture: 'managed-introductions.ts' });
    cy.intercept('GET', '**/api/employee-checklists/employee/ann01che', managerAsEmployeeIntroduction);
    cy.intercept('GET', '**/api/employee-checklists/delegated-to/ann01che', emptyDelegatedIntroductions);
    cy.intercept('GET', '**/api/portalpersondata/personal/ann01che', { fixture: 'employee-response.json' });

    cy.viewport('macbook-15');
    cy.visit('http://localhost:3000');
    cy.get('[data-cy="user-introduction"]').should('exist');
    cy.get('[data-cy="user-introduction-button"]').should('exist').click();
    cy.get('h1').should('exist').contains('Introduktion för Anna Chef');
  });

  it('shows introduction page correctly', () => {
    cy.get('[data-cy="introduction-for-tabs"]').should('not.exist');
    cy.get('[data-cy="introduction-for-tabs-manager-button"]').should('not.exist');
    cy.get('[data-cy="add-activity-button"]').should('not.exist');

    cy.get('[data-cy="sidebar"]').should('exist').contains(managerAsEmployeeIntroduction.data.employee.username);
    cy.get('[data-cy="sidebar"]').should('exist').contains(managerAsEmployeeIntroduction.data.employee.email);
    cy.get('[data-cy="sidebar"]').should('exist').contains(managerAsEmployeeIntroduction.data.startDate);
    cy.get('[data-cy="mentor-content"]').should('exist').contains('Det finns ingen tillagd mentor');
    cy.get('[data-cy="delegated-to-content"]').should('exist').contains('Det finns inga tilldelade medarbetare');
  });

  it('views phases and marks activities as done', () => {
    cy.get('[data-cy="phase-menu-bar"]').contains('Om din anställning');
    cy.get('[data-cy="phase-menu-bar-button"]').contains('Nyanställd chef').should('exist').click({ force: true });

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

  it('can change activity relevance', () => {
    cy.get('[data-cy="phase-menu-bar"]').contains('Om din anställning');

    const introduction = managerAsEmployeeIntroduction;
    const optionalTask = managerAsEmployeeIntroduction.data.phases[1].tasks[0];
    introduction.data.phases[0].tasks[0] = {
      id: optionalTask.id,
      heading: optionalTask.heading,
      questionType: 'COMPLETED_OR_NOT_RELEVANT',
      text: optionalTask.text,
      sortOrder: 0,
      roleType: optionalTask.roleType,
      customTask: optionalTask.customTask,
      responseText: '',
      updated: '2024-12-27T12:30:00Z',
      fulfilmentStatus: 'NOT_RELEVANT',
      updatedBy: 'ann01che',
      optional: true,
    };

    cy.intercept('GET', '**/api/employee-checklists/employee/ann01che', introduction);
    cy.intercept('PATCH', '**/api/employee-checklists/**/tasks/**', introduction.data.phases[0].tasks[0]);

    cy.get('[data-cy="optional-activity-button"]').contains('Markera som inte aktuell').should('exist').click();
    cy.get('[data-cy="optional-activity-button"]').contains('Markera som aktuell');
  });
});
