import { Badge, Label } from '@sk-web-gui/react';
import { useEffect, useState } from 'react';
import { countFinishedTasks } from '@services/checklist-service/checklist-service';
import { Phase, Task } from '@data-contracts/backend/data-contracts';
import { setTimeToBeCompleted } from '@utils/fulfilment-status-utils';

function setLabelColor(totalTasks: number, currentlyCompleted: number) {
  if (currentlyCompleted === 0) return 'tertiary';
  if (currentlyCompleted === totalTasks) return 'gronsta';
  if (currentlyCompleted < totalTasks) return 'vattjom';
}

export const Stepper = (props: any) => {
  const { data, currentView, currentPhase, setCurrentPhase } = props;

  let totalTasks: Task[][] = [];
  if (currentView === 0) {
    totalTasks = data.phases.map((p: Phase) =>
      p.tasks.filter((t: Task) => t.roleType === 'MANAGER_FOR_NEW_EMPLOYEE' || 'MANAGER_FOR_NEW_MANAGER')
    );
  } else {
    totalTasks = data.phases.map((p: Phase) =>
      p.tasks.filter((t: Task) => t.roleType === 'NEW_EMPLOYEE' || 'NEW_MANAGER')
    );
  }

  const finishedTasksCount = countFinishedTasks(data.phases, currentView);

  const handleClick = (index: number) => {
    setCurrentPhase(index);
  };

  return finishedTasksCount ?
      <div>
        {data.phases.map((phase: Phase, index: number) => {
          return (
            <div key={index}>
              <div>
                <p className="my-10">
                  <Badge
                    rounded
                    className={
                      phase.name === data[currentPhase]?.name ?
                        'align-top mr-20 bg:primary-surface'
                      : 'align-top mr-20 tertiary'
                    }
                    inverted={phase.name !== data.phases[currentPhase].name}
                  />
                  {phase.name === data.phases[currentPhase]?.name ?
                    <span className="underline font-bold cursor-pointer" onClick={() => handleClick(index)}>
                      {phase.name}
                    </span>
                  : <span className="underline cursor-pointer" onClick={() => handleClick(index)}>
                      {phase.name}
                    </span>
                  }{' '}
                </p>
              </div>

              <div className={index < data.phases.length - 1 ? 'border-l-2 m-10 pl-12 pb-8' : 'm-10 pl-12 pb-8'}>
                {
                  <Label
                    color={setLabelColor(totalTasks[index].length, finishedTasksCount[index])}
                    className="align-text-bottom mr-4 ml-24"
                    rounded
                    inverted
                  >
                    {finishedTasksCount[index]} av {totalTasks[index].length}
                  </Label>
                }
                <span className="text-small">
                  Klart senast den {setTimeToBeCompleted(data.startDate, data.phases[index].timeToComplete)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    : null;
};
