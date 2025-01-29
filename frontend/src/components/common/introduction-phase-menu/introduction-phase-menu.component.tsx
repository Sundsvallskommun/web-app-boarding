import { Button, MenuBar } from '@sk-web-gui/react';
import {
  countCompletedEmployeeTasks,
  countCompletedManagerTasks,
  countEmployeeTasks,
  countManagerTasks,
} from '@utils/count-tasks';
import Divider from '@sk-web-gui/divider';
import React, { Dispatch, SetStateAction } from 'react';
import { EmployeeChecklist, EmployeeChecklistPhase } from '@data-contracts/backend/data-contracts';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { setTimeToBeCompleted } from '@utils/fulfilment-status-utils';
import { useTranslation } from 'react-i18next';

interface IntroductionPhaseMenuProps {
  data: EmployeeChecklist;
  currentPhase: number;
  setCurrentPhase: Dispatch<SetStateAction<number>>;
  currentView: number;
}

export const IntroductionPhaseMenu: React.FC<IntroductionPhaseMenuProps> = (props) => {
  const { data, currentPhase, setCurrentPhase, currentView } = props;
  const { t } = useTranslation();

  const countTasks = (phase: EmployeeChecklistPhase) => {
    if (currentView === 0) {
      return (
        <>
          {countCompletedManagerTasks(phase)} av {countManagerTasks(phase)}
        </>
      );
    } else {
      return (
        <>
          {countCompletedEmployeeTasks(phase)} av {countEmployeeTasks(phase)}
        </>
      );
    }
  };

  return (
    <>
      <MenuBar current={currentPhase} className="w-full" data-cy="phase-menu-bar">
        {data?.phases.map((phase, index) => {
          return (
            currentView === 0 && countManagerTasks(phase) > 0 ?
              <MenuBar.Item key={index}>
                <Button onClick={() => setCurrentPhase(index)} data-cy="phase-menu-bar-button">
                  {phase.name} ({countTasks(data?.phases[index])})
                </Button>
              </MenuBar.Item>
            : currentView === 1 && countEmployeeTasks(phase) > 0 ?
              <MenuBar.Item key={index}>
                <Button onClick={() => setCurrentPhase(index)} data-cy="phase-menu-bar-button">
                  {phase.name} ({countTasks(data?.phases[index])})
                </Button>
              </MenuBar.Item>
            : null
          );
        })}
      </MenuBar>

      <Divider className="w-full" />

      <div className="pt-24 px-40">
        <h2 className="mb-24 text-h2-md"> {data?.phases[currentPhase]?.name}</h2>
        <p className="mb-md">{data?.phases[currentPhase]?.bodyText}</p>
        <div className="flex mb-24 gap-16">
          <div>
            <Icon name="check" className="align-sub mr-6" size="2rem" />
            {t('task:activities_completed', {
              first:
                currentView === 0 ?
                  countCompletedManagerTasks(data?.phases[currentPhase])
                : countCompletedEmployeeTasks(data?.phases[currentPhase]),
              second:
                currentView === 0 ?
                  countManagerTasks(data?.phases[currentPhase])
                : countEmployeeTasks(data?.phases[currentPhase]),
            })}
          </div>
          <div>
            <Icon name="alarm-clock" className="align-sub mr-6" size="2rem" />
            {t('task:complete_by', {
              date: setTimeToBeCompleted(data?.startDate, data?.phases[currentPhase]?.timeToComplete),
            })}
          </div>
        </div>

        <Divider />
      </div>
    </>
  );
};
