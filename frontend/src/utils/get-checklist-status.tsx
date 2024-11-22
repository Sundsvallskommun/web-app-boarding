import { Label } from '@sk-web-gui/react';
import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';
import { phaseHasNotBeenCompleted, setTimeToBeCompleted } from '@utils/fulfilment-status-utils';
import dayjs from 'dayjs';

export const getChecklistStatusLabel = (checklist: EmployeeChecklist, isManager: boolean) => {
  return (
      checklist.phases.some(
        (phase) =>
          dayjs().isAfter(setTimeToBeCompleted(checklist.startDate, phase.timeToComplete)) &&
          phaseHasNotBeenCompleted(phase, isManager)
      )
    ) ?
      <Label color="error" rounded inverted>
        Försenad
      </Label>
    : <Label color="gronsta" rounded inverted>
        I fas
      </Label>;
};
