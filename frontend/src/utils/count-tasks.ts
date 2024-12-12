import {
  EmployeeChecklist,
  EmployeeChecklistPhase,
  EmployeeChecklistTask,
} from '@data-contracts/backend/data-contracts';

export const countAllTasks = (checklist: EmployeeChecklist) => {
  let sum = 0;

  checklist.phases.map((phase: EmployeeChecklistPhase) => {
    phase.tasks.map((task: EmployeeChecklistTask) => sum++);
  });

  return sum;
};

export const countAllCompletedTasks = (checklist: EmployeeChecklist) => {
  let sum = 0;

  checklist.phases.map((phase: EmployeeChecklistPhase) => {
    phase.tasks.map((task) => (task.fulfilmentStatus === 'TRUE' ? sum++ : null));
  });

  return sum;
};

export const countManagerTasks = (phase: EmployeeChecklistPhase) => {
  let count = 0;

  phase?.tasks?.map((task) => {
    if (task.roleType === 'MANAGER_FOR_NEW_EMPLOYEE' || task.roleType === 'MANAGER_FOR_NEW_MANAGER') {
      count++;
    }
  });

  return count;
};

export const countEmployeeTasks = (phase: EmployeeChecklistPhase) => {
  let count = 0;

  phase?.tasks?.map((task) => {
    if (task.roleType === 'NEW_EMPLOYEE' || task.roleType === 'NEW_MANAGER') {
      count++;
    }
  });

  return count;
};

export const countCompletedManagerTasks = (phase: EmployeeChecklistPhase) => {
  let count = 0;

  phase?.tasks?.map((task) => {
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

  phase?.tasks?.map((task) => {
    if ((task.roleType === 'NEW_EMPLOYEE' || task.roleType === 'NEW_MANAGER') && task.fulfilmentStatus === 'TRUE') {
      count++;
    }
  });

  return count;
};
