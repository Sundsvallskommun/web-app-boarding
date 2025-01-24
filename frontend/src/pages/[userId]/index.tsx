import { ActivityListItem } from '@components/activity-list-item/activity-list-item.component';
import { AddActivityModal } from '@components/add-activity-modal/add-activity-modal.component';
import { ChecklistSidebar } from '@components/checklist-sidebar/checklist-sidebar.component';
import { EmployeeChecklistPhase } from '@data-contracts/backend/data-contracts';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { updateTaskFulfilmentStatus } from '@services/checklist-service/checklist-service';
import { useChecklist } from '@services/checklist-service/use-checklist';
import { useManagedChecklists } from '@services/checklist-service/use-managed-checklists';
import { useUserStore } from '@services/user-service/user-service';
import Divider from '@sk-web-gui/divider';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Button, Checkbox, MenuBar, RadioButton } from '@sk-web-gui/react';
import { Spinner } from '@sk-web-gui/spinner';
import {
  countCompletedEmployeeTasks,
  countCompletedManagerTasks,
  countEmployeeTasks,
  countManagerTasks,
} from '@utils/count-tasks';
import { setTimeToBeCompleted } from '@utils/fulfilment-status-utils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useDelegatedChecklists } from '@services/checklist-service/use-delegated-checklists';
import { useTranslation } from 'react-i18next';

export const CheckList: React.FC = () => {
  const {
    username,
    permissions: { isManager },
  } = useUserStore(useShallow((s) => s.user));
  const router = useRouter();
  const { query } = router;

  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [currentView, setCurrentView] = useState<number>(0);
  const [isUserChecklist, setIsUserChecklist] = useState<boolean>(false);
  const { t } = useTranslation();

  const { data: managedChecklists, refresh: refreshManagedChecklists } = useManagedChecklists();
  const {
    data: employeeChecklist,
    loaded,
    refresh: refreshChecklist,
  } = useChecklist((query?.userId as string) || username);
  const { data: delegatedChecklists, refresh: refreshDelegatedChecklists } = useDelegatedChecklists();

  const managedChecklist = managedChecklists.filter((employee) => employee.employee.username === query?.userId)[0];
  const delegatedChecklist = delegatedChecklists.filter((employee) => employee.employee.username === query?.userId)[0];
  const data =
    currentView === 0 && managedChecklist ? managedChecklist
    : currentView === 0 && delegatedChecklist ? delegatedChecklist
    : employeeChecklist;

  useEffect(() => {
    if (!isManager || (isManager && employeeChecklist?.employee.username === query?.userId)) {
      setCurrentView(1);
      setIsUserChecklist(true);
    }
  }, [isManager]);

  useEffect(() => {
    setCurrentPhase(0);
  }, [currentView]);

  const updateAllTaskFulfilments = (phaseCompletion: boolean) => {
    data?.phases[currentPhase]?.tasks.map((task) => {
      if (currentView === 0) {
        if (task.roleType === 'MANAGER_FOR_NEW_EMPLOYEE' || task.roleType === 'MANAGER_FOR_NEW_MANAGER') {
          updateTaskFulfilmentStatus(data?.id, task.id, phaseCompletion ? 'FALSE' : 'TRUE', username).then(() => {
            delegatedChecklist ? refreshDelegatedChecklists() : refreshManagedChecklists();
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
        {!loaded ?
          <Spinner />
        : <div>
            {loaded && !data ?
              <h2>{t('common:no_introductions')}</h2>
            : data && (
                <div>
                  <h1 className="text-h1-md mb-40">
                    {t('common:introduction_of')} {data?.employee?.firstName} {data?.employee?.lastName}
                  </h1>
                  {!isUserChecklist ?
                    <div className="flex gap-16 my-24 justify-between">
                      <div className="flex">
                        <strong>{t('common:show_introduction_of')} </strong>
                        <RadioButton.Group inline className="mx-16" data-cy="radio-button-group">
                          <RadioButton
                            checked={currentView === 0}
                            value={0}
                            onChange={() => setCurrentView(0)}
                            data-cy="radio-button-manager-view"
                          >
                            {t('common:manager')}
                          </RadioButton>
                          <RadioButton
                            checked={currentView === 1}
                            value={1}
                            onChange={() => setCurrentView(1)}
                            data-cy="radio-button-employee-view"
                          >
                            {t('common:employee')}
                          </RadioButton>
                        </RadioButton.Group>
                      </div>

                      {(managedChecklists || delegatedChecklist) && <AddActivityModal />}
                    </div>
                  : null}

                  <div className="flex gap-40">
                    <div className="w-full rounded bg-background-content border-1 border-divider">
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

                      <div className="py-24 px-40">
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

                        <div className="p-16 mt-16">
                          <Checkbox
                            data-cy="complete-all-activities"
                            className="pr-20"
                            checked={
                              currentView === 0 ?
                                countCompletedManagerTasks(data?.phases[currentPhase]) ===
                                countManagerTasks(data?.phases[currentPhase])
                              : countCompletedEmployeeTasks(data?.phases[currentPhase]) ===
                                countEmployeeTasks(data?.phases[currentPhase])
                            }
                            onClick={() =>
                              updateAllTaskFulfilments(
                                currentView === 0 ?
                                  countCompletedManagerTasks(data?.phases[currentPhase]) ===
                                    countManagerTasks(data?.phases[currentPhase])
                                : countCompletedEmployeeTasks(data?.phases[currentPhase]) ===
                                    countEmployeeTasks(data?.phases[currentPhase])
                              )
                            }
                          />
                          <span className="text-small">{t('task:mark_all_activities_as_completed')}</span>
                        </div>

                        {data?.phases[currentPhase]?.tasks.map((task) => {
                          if (currentView === 0) {
                            if (
                              task.roleType === 'MANAGER_FOR_NEW_EMPLOYEE' ||
                              task.roleType === 'MANAGER_FOR_NEW_MANAGER'
                            ) {
                              return (
                                <ActivityListItem
                                  key={task.id}
                                  task={task}
                                  checklistId={data?.id}
                                  currentView={currentView}
                                  isUserChecklist={isUserChecklist}
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
                                />
                              );
                            }
                          }
                        })}
                      </div>
                    </div>

                    <div className="w-5/12">
                      <ChecklistSidebar isUserChecklist={isUserChecklist} />
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        }
      </Main>
    </DefaultLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'layout',
      'crud',
      'checklists',
      'delegation',
      'task',
      'mentor',
      'user',
    ])),
  },
});

export default CheckList;
