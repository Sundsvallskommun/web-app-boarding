import React from 'react';
import { Checkbox } from '@sk-web-gui/react';
import {
  countCompletedEmployeeTasks,
  countCompletedManagerTasks,
  countEmployeeTasks,
  countManagerTasks,
} from '@utils/count-tasks';
import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';
import { updateTaskFulfilmentStatus } from '@services/checklist-service/checklist-service';
import { useUserStore } from '@services/user-service/user-service';
import { useShallow } from 'zustand/react/shallow';
import { useChecklist } from '@services/checklist-service/use-checklist';
import { useManagedChecklists } from '@services/checklist-service/use-managed-checklists';
import { useTranslation } from 'react-i18next';

interface IntroductionFulFillAllTasksCheckboxProps {
  currentView: number;
  data: EmployeeChecklist;
  currentPhase: number;
}

export const IntroductionFulFillAllTasksCheckbox: React.FC<IntroductionFulFillAllTasksCheckboxProps> = (props) => {
  const { currentView, currentPhase, data } = props;
  const { username } = useUserStore(useShallow((s) => s.user));
  const { t } = useTranslation();

  const { refresh: refreshChecklist } = useChecklist(data.employee.username);
  const { refresh: refreshManagedChecklists } = useManagedChecklists();

  const updateAllTaskFulfillments = (phaseCompletion: boolean) => {
    data?.phases[currentPhase]?.tasks.map((task) => {
      if (currentView === 0) {
        if (task.roleType === 'MANAGER_FOR_NEW_EMPLOYEE' || task.roleType === 'MANAGER_FOR_NEW_MANAGER') {
          updateTaskFulfilmentStatus(data?.id, task.id, phaseCompletion ? 'FALSE' : 'TRUE', username).then(() => {
            refreshManagedChecklists(data?.manager.username);
          });
        }
      } else {
        if (task.roleType === 'NEW_EMPLOYEE' || task.roleType === 'NEW_MANAGER') {
          updateTaskFulfilmentStatus(data?.id, task.id, phaseCompletion ? 'FALSE' : 'TRUE', username).then(() => {
            refreshChecklist();
          });
        }
      }
    });
  };

  return (
    <div className="p-16">
      <Checkbox
        data-cy="complete-all-activities"
        className="pr-20"
        checked={
          currentView === 0 ?
            countCompletedManagerTasks(data?.phases[currentPhase]) === countManagerTasks(data?.phases[currentPhase])
          : countCompletedEmployeeTasks(data?.phases[currentPhase]) === countEmployeeTasks(data?.phases[currentPhase])
        }
        onClick={() =>
          updateAllTaskFulfillments(
            currentView === 0 ?
              countCompletedManagerTasks(data?.phases[currentPhase]) === countManagerTasks(data?.phases[currentPhase])
            : countCompletedEmployeeTasks(data?.phases[currentPhase]) === countEmployeeTasks(data?.phases[currentPhase])
          )
        }
      />
      <span className="text-small">{t('task:mark_all_activities_as_completed')}</span>
    </div>
  );
};
