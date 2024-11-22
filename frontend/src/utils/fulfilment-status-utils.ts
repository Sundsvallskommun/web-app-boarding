import dayjs from 'dayjs';
import { EmployeeChecklistPhase } from '@data-contracts/backend/data-contracts';

export const setTimeToBeCompleted = (startDate: string, timeToComplete: string) => {
  const start = dayjs(startDate);

  switch (timeToComplete) {
    case 'P-1D':
      return start.subtract(1, 'days').format('YYYY-MM-DD');
    case 'P1D':
      return start.format('YYYY-MM-DD');
    case 'P1W':
      return start.add(7, 'days').format('YYYY-MM-DD');
    case 'P6M':
      return start.add(6, 'months').format('YYYY-MM-DD');
    default:
      return null;
  }
};

export const phaseHasNotBeenCompleted = (phase: EmployeeChecklistPhase, isManager: boolean) => {
  return phase.tasks.some((task) => {
    return isManager ?
        (task.roleType === 'MANAGER_FOR_NEW_EMPLOYEE' || task.roleType === 'MANAGER_FOR_NEW_MANAGER') &&
          task.fulfilmentStatus === ('EMPTY' || 'FALSE')
      : (task.roleType === 'NEW_EMPLOYEE' || task.roleType === 'NEW_MANAGER') &&
          task.fulfilmentStatus === ('EMPTY' || 'FALSE');
  });
};
