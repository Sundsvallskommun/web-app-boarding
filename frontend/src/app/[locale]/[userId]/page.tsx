'use client';

import { ChecklistSidebar } from '@components/checklist-sidebar/checklist-sidebar.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useChecklist } from '@services/checklist-service/use-checklist';
import { useManagedChecklists } from '@services/checklist-service/use-managed-checklists';
import { useUserStore } from '@services/user-service/user-service';
import { Spinner } from '@sk-web-gui/spinner';
import { useParams, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { TaskModal } from '@components/task-modal/task-modal.component';
import { useShallow } from 'zustand/react/shallow';
import { useDelegatedChecklists } from '@services/checklist-service/use-delegated-checklists';
import { useTranslation } from 'react-i18next';
import { IntroductionPhaseMenu } from '@components/common/introduction-phase-menu/introduction-phase-menu.component';
import { IntroductionActivityList } from '@components/common/introduction-activity-list/introduction-activity-list.component';
import { Button, Tabs } from '@sk-web-gui/react';
import { useSnackbar } from '@utils/use-snackbar';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';
import { removeDelegation } from '@services/checklist-service/checklist-service';

const CUSTOM_TASK_OFFSET = 6000;

const getNewSortOrder = (data: EmployeeChecklist | null, currentPhase: number) => {
  const customTasks = data?.phases?.[currentPhase]?.tasks.filter((task) => task.customTask) || [];
  return (customTasks[customTasks.length - 1]?.sortOrder || CUSTOM_TASK_OFFSET) + 1;
};

export default function CheckList() {
  const {
    username,
    email,
    permissions: { isManager },
  } = useUserStore(useShallow((s) => s.user));
  const router = useRouter();
  const params = useParams<{ locale: string; userId: string }>();
  const userId = params?.userId;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const toastMessage = useSnackbar();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [currentView, setCurrentView] = useState<number>(0);
  const [isUserChecklist, setIsUserChecklist] = useState<boolean>(false);
  const { t } = useTranslation();

  const {
    refresh: refreshManagedChecklists,
    data: managedChecklists,
    loading: managedChecklistsLoading,
    loaded: managedChecklistLoaded,
  } = useManagedChecklists();
  const {
    refresh: refreshChecklist,
    data: employeeChecklist,
    loading: checklistLoading,
    loaded: employeeChecklistLoaded,
  } = useChecklist(userId || username);
  const {
    refresh: refreshDelegatedChecklists,
    data: delegatedChecklists,
    loading: delegatedChecklistLoading,
    loaded: delegatedChecklistsLoaded,
  } = useDelegatedChecklists();

  const refreshAllChecklists = async () => {
    refreshChecklist();
    refreshDelegatedChecklists();
    refreshManagedChecklists(data?.manager.username);
  };

  const isLoading = managedChecklistsLoading || checklistLoading || delegatedChecklistLoading;
  const isLoaded = managedChecklistLoaded && employeeChecklistLoaded && delegatedChecklistsLoaded;

  const managedChecklist = managedChecklists.find(
    (checklist) => checklist.employee.username === userId && checklist.manager.username === username
  );

  const delegatedChecklist = delegatedChecklists.find((checklist) => checklist.employee.username === userId);

  const data = currentView === 0 ? (managedChecklist ?? delegatedChecklist ?? employeeChecklist) : employeeChecklist;

  const handleRemoveDelegation = () => {
    if (!data) return;
    removeDelegation(data.id, email)
      .then(() => {
        refreshDelegatedChecklists();
        router.push('/');
      })
      .catch(() => {
        toastMessage({
          position: 'bottom',
          closeable: false,
          message: t('delegation:errors.remove'),
          status: 'error',
        });
      });
  };

  useEffect(() => {
    if (!isManager || employeeChecklist?.employee?.username === userId) {
      setCurrentView(1);
      setIsUserChecklist(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isManager]);

  useEffect(() => {
    setCurrentPhase(0);
  }, [currentView]);

  const newSortOrder = getNewSortOrder(data, currentPhase);

  const renderedData = (data: EmployeeChecklist) => (
    <div className="grow rounded bg-background-content border-1 border-divider">
      <IntroductionPhaseMenu
        data={data}
        currentPhase={currentPhase}
        setCurrentPhase={setCurrentPhase}
        currentView={currentView}
        refreshAllChecklists={refreshAllChecklists}
      />
      <div className="py-24 px-40">
        <IntroductionActivityList
          data={data}
          currentView={currentView}
          currentPhase={currentPhase}
          isUserChecklist={isUserChecklist}
        />
      </div>
    </div>
  );

  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME}`}>
      <Main>
        {isLoading || !isLoaded ?
          <Spinner className="mx-auto my-40" />
        : <div>
            {data ?
              <div>
                {delegatedChecklist && (
                  <div className="flex grow gap-40 justify-between mt-56 border-1 border-divider rounded-button bg-background-200 py-10 px-16 w-[91rem]">
                    {t('delegation:info', { manager: data?.manager?.firstName + ' ' + data?.manager?.lastName })}
                    <Button onClick={handleRemoveDelegation} variant="secondary" className="self-center mr-8">
                      {t('delegation:remove')}
                    </Button>
                  </div>
                )}
                <h1 className="text-h1-md mt-56 mb-40">
                  {t('common:introduction_of')} {data?.employee?.firstName} {data?.employee?.lastName || ''}
                </h1>
                <div className="flex gap-40">
                  {!isUserChecklist ?
                    <div className="flex grow gap-16 mb-24 w-[90rem] mt-8">
                      <Tabs current={currentView} data-cy="introduction-for-tabs">
                        <Tabs.Item>
                          <Tabs.Button onClick={() => setCurrentView(0)} data-cy="introduction-for-tabs-manager-button">
                            {t('task:your_activity')}
                          </Tabs.Button>
                          <Tabs.Content>{renderedData(data)}</Tabs.Content>
                        </Tabs.Item>
                        <Tabs.Item>
                          <Tabs.Button
                            onClick={() => setCurrentView(1)}
                            data-cy="introduction-for-tabs-employee-button"
                          >
                            {t('task:employee_activity')}
                          </Tabs.Button>
                          <Tabs.Content>{renderedData(data)}</Tabs.Content>
                        </Tabs.Item>
                      </Tabs>
                    </div>
                  : renderedData(data)}

                  <div className="w-[40rem]">
                    {managedChecklists.length > 0 && !delegatedChecklist && !isUserChecklist && (
                      <div className="flex flex-row-reverse">
                        <Button
                          className="mb-24 px-16"
                          variant="primary"
                          color="vattjom"
                          onClick={openModal}
                          inverted
                          data-cy="add-activity-button"
                        >
                          <Icon name="plus" size="18px" />{' '}
                          {currentView === 0 ? t('task:add_activity_for_manager') : t('task:add_activity_for_employee')}
                        </Button>
                      </div>
                    )}

                    <div className={delegatedChecklist ? 'mt-64' : 'mt-0'}>
                      <ChecklistSidebar
                        isUserChecklist={isUserChecklist}
                        isDelegatedChecklist={!managedChecklist && !!delegatedChecklist}
                      />
                    </div>
                  </div>
                </div>
              </div>
            : <h2>{t('common:no_introductions')}</h2>}
          </div>
        }
      </Main>
      <TaskModal
        isModalOpen={isModalOpen}
        closeModalHandler={closeModal}
        mode="add"
        checklistId={data?.id}
        currentView={currentView}
        data={data}
        newSortOrder={newSortOrder}
      />
    </DefaultLayout>
  );
}
