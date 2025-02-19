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
import { useDelegatedChecklists } from '@services/checklist-service/use-delegated-checklists';

interface IntroductionFulFillAllTasksCheckboxProps {
  currentView: number;
  data: EmployeeChecklist;
  currentPhase: number;
  refreshAllChecklists: () => Promise<void>;
}

export const IntroductionFulFillAllTasksCheckbox: React.FC<IntroductionFulFillAllTasksCheckboxProps> = (props) => {
  const { currentView, currentPhase, data } = props;
  const { username } = useUserStore(useShallow((s) => s.user));
  const { t } = useTranslation();

  const updateAllTaskFulfillments = async (phaseCompletion: boolean) => {
    const updatePromises = data?.phases[currentPhase]?.tasks.map((task) => {
      return updateTaskFulfilmentStatus(data?.id, task.id, phaseCompletion ? 'FALSE' : 'TRUE', username);
    });
    Promise.all(updatePromises).then(() => {
      props.refreshAllChecklists();
    });
  };

  return (
    <div className="px-16">
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
