import { emptyDelegatedIntroductions, emptyEmployeeIntroduction } from '../../fixtures/empty-introductions';
import {
  addCustomTaskResponse,
  assignMentorResponse,
  editCustomTaskResponse,
  employeeIntroduction,
  employeeIntroductionWithoutMentor,
  removeAssignedMentorResponse,
  removeCustomTaskResponse,
  removeDelegationResponse,
} from '../../fixtures/employee-introduction';
import {
  delegatedIntroductionResponse,
  managedIntroductions,
  searchEmployeeResponse,
} from '../../fixtures/managed-introductions';
import { managerAsEmployeeIntroduction } from '../../fixtures/manager-as-employee-introduction';

describe('Employee introduction as manager', () => {
  beforeEach(() => {
    cy.intercept('GET', '**/api/me', { fixture: 'me-manager.json' });
    cy.intercept('GET', '**/api/employee-checklists/manager/ann01che', managedIntroductions);
    cy.intercept('GET', '**/api/employee-checklists/employee/ann01che', emptyEmployeeIntroduction);
    cy.intercept('GET', '**/api/employee-checklists/delegated-to/ann01che', emptyDelegatedIntroductions);
    cy.intercept('GET', '**/api/portalpersondata/personal/**', { fixture: 'employee-response.json' });
    cy.intercept('GET', '**/api/employee-checklists/employee/emp01emp', employeeIntroduction).as(
      'getEmployeeIntroductionAfterClick'
    );

    cy.viewport('macbook-15');
    cy.visit('http://localhost:3000');
    cy.get('[data-cy="managed-checklists-table"]').should('exist');
    cy.get('[data-cy="table-row-button-0"]').should('exist').click();
    cy.wait('@getEmployeeIntroductionAfterClick');
  });

  it('shows manager introduction correctly', () => {
    cy.get('h1').should('contain', 'Introduktion för Elon New Employee-One');
    cy.get('[data-cy="radio-button-group"]').should('exist');
    cy.get('[data-cy="radio-button-manager-view"]').should('exist');
    cy.get('[data-cy="add-activity-button"]').should('exist');
  });

  it('shows sidebar correctly', () => {
    cy.get('[data-cy="sidebar"]').should('exist');
    cy.get('[data-cy="sidebar"]').contains(employeeIntroduction.data.employee.username);
    cy.get('[data-cy="sidebar"]').contains(employeeIntroduction.data.employee.email);
    cy.get('[data-cy="sidebar"]').contains(employeeIntroduction.data.startDate);
  });

  it('views employee phases and marks activities as done', () => {
    cy.get('h1').should('contain', 'Introduktion för Elon New Employee-One');
    cy.get('[data-cy="radio-button-group"]').should('exist');
    cy.get('[data-cy="radio-button-employee-view"]').should('exist').click();

    cy.get('[data-cy="phase-menu-bar"]').contains('Om din anställning').should('exist');

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

  it('can add custom activity', () => {
    cy.intercept('POST', '**/api/employee-checklists/**/phases/**/customtasks', addCustomTaskResponse);
    cy.get('[data-cy="add-activity-button"]').should('exist').click();
    cy.get('[data-cy="add-activity-phase-select"]').should('exist').select('Om din anställning');
    cy.get('[data-cy="activity-heading"]').should('exist').type('Ny aktivitet').clear();
    cy.get('[data-cy="activity-text"]').should('exist').type('Beskrivning av ny aktivitet');
    cy.get('[data-cy="activity-save-button"]').contains('Lägg till').click();
    cy.get('[data-cy="activity-heading-error"]').should('exist').contains('Du måste skriva en rubrik');
    cy.get('[data-cy="activity-heading"]').should('exist').type('Ny aktivitet');
    cy.get('[data-cy="activity-heading-reference"]').should('exist').type('https://www.google.com');
    cy.get('[data-cy="activity-save-button"]').contains('Lägg till').click();
  });

  it('can edit and remove custom activity', () => {
    cy.intercept('PATCH', '**/api/employee-checklists/**/customtasks/**', editCustomTaskResponse);
    cy.intercept('DELETE', '**/api/employee-checklists/**/customtasks/**', removeCustomTaskResponse);

    cy.get('h1').should('contain', 'Introduktion för Elon New Employee-One');
    cy.get('[data-cy="radio-button-group"]').should('exist');
    cy.get('[data-cy="radio-button-employee-view"]').should('exist').click();
    cy.get('[data-cy="edit-custom-activity-popup-menu"]').should('exist').click();
    cy.get('[data-cy="edit-custom-activity-popup-menu-edit"]').should('exist').click();
    cy.get('[data-cy="activity-heading"]').should('exist').clear().type('Redigerad aktivitet');
    cy.get('[data-cy="activity-text"]').should('exist').clear().type('Redigerad text');
    cy.get('[data-cy="activity-heading-reference"]').should('exist').clear().type('https://www.google.se');
    cy.get('[data-cy="activity-save-button"]').should('exist').click();

    cy.get('[data-cy="edit-custom-activity-popup-menu"]').should('exist').click();
    cy.get('[data-cy="edit-custom-activity-popup-menu-remove"]').should('exist').click();
    cy.intercept('GET', '**/api/employee-checklists/employee/emp01emp', employeeIntroductionWithoutMentor);
  });

  it('can delegate introduction and remove delegation', () => {
    cy.intercept('GET', '**/api/portalpersondata/personal/**', searchEmployeeResponse).as('searchEmployee');
    cy.intercept('DELETE', '**/api/employee-checklists/**/delegated-to/**', removeDelegationResponse);

    cy.get('[data-cy="delegate-introduction-button"]').should('exist').click();

    cy.get('[data-cy="search-employee-input"]').should('exist').type('anv01anv');
    cy.get('button').contains('Sök').click();
    cy.wait('@searchEmployee');
    cy.get('[data-cy="search-result-card"]').should('exist').contains('Användare Användarsson');
    cy.get('[data-cy="add-search-result-button"]').should('have.text', 'Lägg till').should('exist').click();
    cy.get('[data-cy="remove-selected-user-button"]').should('exist').click();

    cy.get('[data-cy="search-employee-input"]').should('exist').type('anv01anv');
    cy.get('button').contains('Sök').click();
    cy.wait('@searchEmployee');
    cy.get('[data-cy="add-search-result-button"]').should('exist').should('have.text', 'Lägg till').click();
    cy.intercept('POST', '**/api/employee-checklists/**/delegate-to/**', delegatedIntroductionResponse);
    cy.get('[data-cy="assign-delegations-button"]')
      .should('exist')
      .should('have.text', 'Tilldela')
      .click({ force: true });

    cy.get('[data-cy="search-employee-input"]').should('not.exist');

    cy.get('[data-cy="delegated-to-0"]').should('exist').contains('anv01anv@example.com');
    cy.get('[data-cy="remove-delegation-icon-0"]').should('exist').click();
    cy.get('button').contains('Ta bort').should('have.css', 'color', 'rgb(255, 255, 255)').click();
  });

  it('can add and remove mentor', () => {
    cy.intercept('GET', '**/api/portalpersondata/personal/**', searchEmployeeResponse).as('searchEmployee');
    cy.intercept('DELETE', '**/api/employee-checklists/**/mentor', removeAssignedMentorResponse);
    cy.get('[data-cy="remove-assigned-mentor-button"]').should('exist').click();
    cy.intercept('GET', '**/api/employee-checklists/employee/emp01emp', employeeIntroductionWithoutMentor);
    cy.get('button').contains('Ta bort').should('have.css', 'color', 'rgb(255, 255, 255)').click();
    cy.intercept('PUT', '**/api/employee-checklists/**/mentor', assignMentorResponse);

    cy.get('[data-cy="add-mentor-button"]').should('have.text', 'Lägg till mentor').click();
    cy.get('[data-cy="search-employee-input"]').should('exist').type('anv01anv');
    cy.get('button').contains('Sök').click();
    cy.wait('@searchEmployee');
    cy.get('[data-cy="add-search-result-button"]').should('exist').should('have.text', 'Lägg till').click();

    cy.get('[data-cy="assign-mentor-button"]').should('exist').click();

    cy.get('[data-cy="search-employee-input"]').should('not.exist');
  });
});
