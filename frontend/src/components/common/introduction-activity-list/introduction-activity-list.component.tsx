import { ActivityListItem } from '@components/activity-list-item/activity-list-item.component';
import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';
import { useChecklist } from '@services/checklist-service/use-checklist';
import { useDelegatedChecklists } from '@services/checklist-service/use-delegated-checklists';
import { useManagedChecklists } from '@services/checklist-service/use-managed-checklists';
import React from 'react';

interface IntroductionActivityListProps {
  data: EmployeeChecklist;
  currentPhase: number;
  currentView: number;
  isUserChecklist: boolean;
}

export const IntroductionActivityList: React.FC<IntroductionActivityListProps> = (props) => {
  const { data, currentPhase, currentView, isUserChecklist } = props;
  const { refresh: refreshChecklist } = useChecklist();
  const { refresh: refreshDelegatedChecklists } = useDelegatedChecklists();
  const { refresh: refreshManagedChecklists } = useManagedChecklists();

  const refreshAllChecklists = () =>
    Promise.all([refreshChecklist(), refreshDelegatedChecklists(), refreshManagedChecklists(data?.manager.username)]);

  return (
    <>
      {data?.phases[currentPhase]?.tasks
        .sort((a, b) => a.sortOrder - b.sortOrder)
        .map((task) => {
          if (currentView === 0) {
            if (task.roleType === 'MANAGER_FOR_NEW_EMPLOYEE' || task.roleType === 'MANAGER_FOR_NEW_MANAGER') {
              return (
                <ActivityListItem
                  key={task.id}
                  task={task}
                  checklistId={data?.id}
                  currentView={currentView}
                  isUserChecklist={isUserChecklist}
                  managerUsername={data?.manager.username}
                  refreshAllChecklists={refreshAllChecklists}
                />
              );
            }
          } else {
            if (task.roleType === 'NEW_EMPLOYEE' || task.roleType === 'NEW_MANAGER') {
              return (
                <ActivityListItem
                  key={task.id}
                  task={task}
                  checklistId={data?.id}
                  currentView={currentView}
                  isUserChecklist={isUserChecklist}
                  managerUsername={data?.manager.username}
                  refreshAllChecklists={refreshAllChecklists}
                />
              );
            }
          }
        })}
    </>
  );
};
