import { EmployeeChecklistPhase } from '@data-contracts/backend/data-contracts';

export const countManagerTasks = (phase: EmployeeChecklistPhase) => {
  let count = 0;

  phase.tasks.map((task) => {
    if (task.roleType === 'MANAGER_FOR_NEW_EMPLOYEE' || task.roleType === 'MANAGER_FOR_NEW_MANAGER') {
      count++;
    }
  });

  return count;
};

export const countEmployeeTasks = (phase: EmployeeChecklistPhase) => {
  let count = 0;

  phase.tasks.map((task) => {
    if (task.roleType === 'NEW_EMPLOYEE' || task.roleType === 'NEW_MANAGER') {
      count++;
    }
  });

  return count;
};

export const countCompletedManagerTasks = (phase: EmployeeChecklistPhase) => {
  let count = 0;

  phase.tasks.map((task) => {
    if (
      (task.roleType === 'MANAGER_FOR_NEW_EMPLOYEE' || task.roleType === 'MANAGER_FOR_NEW_MANAGER') &&
      task.fulfilmentStatus === 'TRUE'
    ) {
      count++;
    }
  });

  return count;
};

export const countCompletedEmployeeTasks = (phase: EmployeeChecklistPhase) => {
  let count = 0;

  phase.tasks.map((task) => {
    if ((task.roleType === 'NEW_EMPLOYEE' || task.roleType === 'NEW_MANAGER') && task.fulfilmentStatus === 'TRUE') {
      count++;
    }
  });

  return count;
};
