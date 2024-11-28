import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { Button, MenuBar, RadioButton, Checkbox } from '@sk-web-gui/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ActivityListItem } from '@components/activity-list-item/activity-list-item.component';
import {
  getChecklistAsEmployee,
  getChecklistsAsManager,
  updateTaskFulfilmentStatus,
} from '@services/checklist-service/checklist-service';
import { useAppContext } from '@contexts/app.context';
import { EmployeeChecklist, EmployeeChecklistPhase } from '@data-contracts/backend/data-contracts';
import { Spinner } from '@sk-web-gui/spinner';
import { ChecklistSidebar } from '@components/checklist-sidebar/checklist-sidebar.component';
import Divider from '@sk-web-gui/divider';
import { useUserStore } from '@services/user-service/user-service';
import { shallow } from 'zustand/shallow';
import { AddActivityModal } from '@components/add-activity-modal/add-activity-modal.component';
import {
  countCompletedEmployeeTasks,
  countCompletedManagerTasks,
  countEmployeeTasks,
  countManagerTasks,
} from '@utils/count-tasks';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { setTimeToBeCompleted } from '@utils/fulfilment-status-utils';

export const CheckList: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const router = useRouter();
  const { query } = router;
  const { asEmployeeChecklists, setAsEmployeeChecklists, asManagerChecklists, setAsManagerChecklists } =
    useAppContext();

  const [data, setData] = useState<EmployeeChecklist>();
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [currentView, setCurrentView] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    getChecklistsAsManager(user.username).then((res) => {
      setAsManagerChecklists(res);
    });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    if (asManagerChecklists.length > 0) {
      getChecklistAsEmployee(query.userId.toString()).then((res) => {
        setAsEmployeeChecklists(res);
      });
      setData(asManagerChecklists.filter((employee) => employee.employee.username === query?.userId)[0]);
    } else {
      getChecklistAsEmployee(user.username).then((res) => {
        setAsEmployeeChecklists(res);
      });
      setData(asEmployeeChecklists);
      setCurrentView(1);
    }
    setIsLoading(false);
  }, [asManagerChecklists]);

  useEffect(() => {
    if (currentView === 0) {
      setData(asManagerChecklists.filter((employee) => employee.employee.username === query?.userId)[0]);
    } else {
      setData(asEmployeeChecklists);
    }
  }, [currentView, asManagerChecklists, asEmployeeChecklists]);

  useEffect(() => {
    setCurrentPhase(0);
  }, [currentView]);

  const updateAllTaskFulfilments = (phaseCompletion: boolean) => {
    data.phases[currentPhase].tasks.map((task) => {
      if (currentView === 0) {
        if (task.roleType === 'MANAGER_FOR_NEW_EMPLOYEE' || task.roleType === 'MANAGER_FOR_NEW_MANAGER') {
          updateTaskFulfilmentStatus(data.id, task.id, phaseCompletion ? 'FALSE' : 'TRUE', user.username).then(() => {
            getChecklistsAsManager(user.username).then((res) => setAsManagerChecklists(res));
          });
        }
      } else {
        if (task.roleType === 'NEW_EMPLOYEE' || task.roleType === 'NEW_MANAGER') {
          updateTaskFulfilmentStatus(data.id, task.id, phaseCompletion ? 'FALSE' : 'TRUE', user.username).then(() => {
            getChecklistAsEmployee(asEmployeeChecklists.employee.username).then((res) => {
              setAsEmployeeChecklists(res);
            });
          });
        }
      }
    });
  };

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
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME}`}>
      <Main>
        {isLoading ?
          <Spinner />
        : <div>
            {!data ?
              <h2>Du har ingen pågående introduktion.</h2>
            : <div>
                <h1 className="text-h1-md mb-40">
                  Introduktion för {data.employee.firstName} {data.employee.lastName}
                </h1>
                {asManagerChecklists.length ?
                  <div className="flex gap-16 my-24 justify-between">
                    <div className="flex">
                      <strong>Visa checklista för </strong>
                      <RadioButton.Group inline className="mx-16">
                        <RadioButton checked={currentView === 0} value={0} onChange={() => setCurrentView(0)}>
                          Chef
                        </RadioButton>
                        <RadioButton checked={currentView === 1} value={1} onChange={() => setCurrentView(1)}>
                          Anställd
                        </RadioButton>
                      </RadioButton.Group>
                    </div>

                    {asManagerChecklists.length && <AddActivityModal />}
                  </div>
                : null}

                <div className="flex gap-40">
                  <div className="w-full rounded bg-white border-1 border-divider">
                    <MenuBar current={currentPhase} className="w-full">
                      {data.phases.map((phase, index) => {
                        return (
                          currentView === 0 && countManagerTasks(phase) > 0 ?
                            <MenuBar.Item key={index}>
                              <Button onClick={() => setCurrentPhase(index)}>
                                {phase.name} ({countTasks(data.phases[index])})
                              </Button>
                            </MenuBar.Item>
                          : currentView === 1 && countEmployeeTasks(phase) > 0 ?
                            <MenuBar.Item key={index}>
                              <Button onClick={() => setCurrentPhase(index)}>
                                {phase.name} ({countTasks(data.phases[index])})
                              </Button>
                            </MenuBar.Item>
                          : null
                        );
                      })}
                    </MenuBar>

                    <Divider className="w-full" />

                    <div className="py-24 px-40">
                      <h2 className="mb-24 text-h2-md"> {data.phases[currentPhase].name}</h2>
                      <div className="flex mb-24 gap-16">
                        <div>
                          <Icon name="check" className="align-sub" size="2rem" />{' '}
                          <strong>{countTasks(data.phases[currentPhase])}</strong> aktiviteter klara
                        </div>
                        <div>
                          <Icon name="alarm-clock" className="align-sub" size="2rem" /> Slutför senast{' '}
                          {setTimeToBeCompleted(data.startDate, data.phases[currentPhase].timeToComplete)}
                        </div>
                      </div>

                      <Divider />

                      <div className="p-16 mt-16">
                        <Checkbox
                          className="pr-20"
                          checked={
                            currentView === 0 ?
                              countCompletedManagerTasks(data.phases[currentPhase]) ===
                              countManagerTasks(data.phases[currentPhase])
                            : countCompletedEmployeeTasks(data.phases[currentPhase]) ===
                              countEmployeeTasks(data.phases[currentPhase])
                          }
                          onClick={() =>
                            updateAllTaskFulfilments(
                              currentView === 0 ?
                                countCompletedManagerTasks(data.phases[currentPhase]) ===
                                  countManagerTasks(data.phases[currentPhase])
                              : countCompletedEmployeeTasks(data.phases[currentPhase]) ===
                                  countEmployeeTasks(data.phases[currentPhase])
                            )
                          }
                        />
                        <span className="text-small">Markera alla aktiviteter som klar</span>
                      </div>

                      {data.phases[currentPhase].tasks.map((task) => {
                        if (currentView === 0) {
                          if (
                            task.roleType === 'MANAGER_FOR_NEW_EMPLOYEE' ||
                            task.roleType === 'MANAGER_FOR_NEW_MANAGER'
                          ) {
                            return (
                              <ActivityListItem
                                key={task.id}
                                task={task}
                                checklistId={data.id}
                                employee={data.employee.username}
                                currentView={currentView}
                              />
                            );
                          }
                        } else {
                          if (task.roleType === 'NEW_EMPLOYEE' || task.roleType === 'NEW_MANAGER') {
                            return (
                              <ActivityListItem
                                key={task.id}
                                task={task}
                                checklistId={data.id}
                                employee={data.employee.username}
                                currentView={currentView}
                              />
                            );
                          }
                        }
                      })}
                    </div>
                  </div>

                  <div className="w-5/12">
                    <ChecklistSidebar />
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </Main>
    </DefaultLayout>
  );
};

export default CheckList;
