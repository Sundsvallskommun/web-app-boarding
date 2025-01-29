import React from 'react';
import { ActivityListItem } from '@components/activity-list-item/activity-list-item.component';
import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';

interface IntroductionActivityListProps {
  data: EmployeeChecklist;
  currentPhase: number;
  currentView: number;
  isUserChecklist: boolean;
}

export const IntroductionActivityList: React.FC<IntroductionActivityListProps> = (props) => {
  const { data, currentPhase, currentView, isUserChecklist } = props;

  return (
    <>
      {data?.phases[currentPhase]?.tasks.map((task) => {
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
              />
            );
          }
        }
      })}
    </>
  );
};
