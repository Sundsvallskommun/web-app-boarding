import { ChecklistSidebar } from '@components/checklist-sidebar/checklist-sidebar.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useChecklist } from '@services/checklist-service/use-checklist';
import { useManagedChecklists } from '@services/checklist-service/use-managed-checklists';
import { useUserStore } from '@services/user-service/user-service';
import { Spinner } from '@sk-web-gui/spinner';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { TaskModal, TaskModalProps } from '@components/task-modal/task-modal.component';
import { useShallow } from 'zustand/react/shallow';
import { useDelegatedChecklists } from '@services/checklist-service/use-delegated-checklists';
import { useTranslation } from 'react-i18next';
import { IntroductionPhaseMenu } from '@components/common/introduction-phase-menu/introduction-phase-menu.component';
import { IntroductionViewToggle } from '@components/common/introduction-view-toggle/introduction-view-toggle.component';
import { IntroductionFulFillAllTasksCheckbox } from '@components/common/introduction-fulfill-all-tasks-checkbox/introduction-fulfill-all-tasks-checkbox.component';
import { IntroductionActivityList } from '@components/common/introduction-activity-list/introduction-activity-list.component';
import { Button } from '@sk-web-gui/react';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';

export const CheckList: React.FC = () => {
  const {
    username,
    permissions: { isManager },
  } = useUserStore(useShallow((s) => s.user));
  const router = useRouter();
  const { query } = router;
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (props: Omit<TaskModalProps, 'closeModalHandler' | 'isModalOpen'>) => {
    setModalProps(props);
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [currentView, setCurrentView] = useState<number>(0);
  const [isUserChecklist, setIsUserChecklist] = useState<boolean>(false);
  const { t } = useTranslation();

  const { refresh: refreshManagedChecklists, data: managedChecklists } = useManagedChecklists();
  const {
    refresh: refreshChecklist,
    data: employeeChecklist,
    loaded,
  } = useChecklist((query?.userId as string) || username);
  const { refresh: refreshDelegatedChecklists, data: delegatedChecklists } = useDelegatedChecklists();

  const refreshAllChecklists = async () => {
    await refreshChecklist();
    await refreshDelegatedChecklists();
    await refreshManagedChecklists(data?.manager.username);
  };

  const managedChecklist = managedChecklists.filter(
    (checklist) => checklist.employee.username === query?.userId && checklist.manager.username === username
  )[0];

  const delegatedChecklist = delegatedChecklists.filter(
    (checklist) => checklist.employee.username === query?.userId
  )[0];

  const data =
    currentView === 0 && managedChecklist ? managedChecklist
    : currentView === 0 && delegatedChecklist ? delegatedChecklist
    : employeeChecklist;

  const [modalProps, setModalProps] = useState<Omit<TaskModalProps, 'closeModalHandler' | 'isModalOpen'>>({
    mode: 'add',
    checklistId: '',
    currentView: currentView,
    data: data,
  });

  useEffect(() => {
    if (!isManager || (isManager && employeeChecklist?.employee?.username === query?.userId)) {
      setCurrentView(1);
      setIsUserChecklist(true);
    }
  }, [isManager]);

  useEffect(() => {
    setCurrentPhase(0);
  }, [currentView]);

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
                  <h1 className="text-h1-md my-40">
                    {t('common:introduction_of')} {data?.employee?.firstName} {data?.employee?.lastName}
                  </h1>
                  {!isUserChecklist ?
                    <div className="flex gap-16 my-24 justify-between">
                      <IntroductionViewToggle currentView={currentView} setCurrentView={setCurrentView} />

                      {(managedChecklists || delegatedChecklist) && (
                        <div>
                          <Button
                            variant="primary"
                            color="vattjom"
                            onClick={() => openModal({ mode: 'add', checklistId: data?.id, currentView, data })}
                            inverted
                            data-cy="add-activity-button"
                          >
                            <Icon name="plus" size="18px" />{' '}
                            {currentView === 0 ?
                              t('task:add_activity_for_manager')
                            : t('task:add_activity_for_employee')}
                          </Button>
                        </div>
                      )}
                    </div>
                  : null}

                  <div className="flex gap-40">
                    <div className="w-full rounded bg-background-content border-1 border-divider">
                      <IntroductionPhaseMenu
                        data={data}
                        currentPhase={currentPhase}
                        setCurrentPhase={setCurrentPhase}
                        currentView={currentView}
                      />

                      <div className="py-24 px-40">
                        <IntroductionFulFillAllTasksCheckbox
                          currentView={currentView}
                          currentPhase={currentPhase}
                          data={data}
                          refreshAllChecklists={refreshAllChecklists}
                        />

                        <IntroductionActivityList
                          data={data}
                          currentView={currentView}
                          currentPhase={currentPhase}
                          isUserChecklist={isUserChecklist}
                        />
                      </div>
                    </div>

                    <div className="w-5/12">
                      <ChecklistSidebar
                        isUserChecklist={isUserChecklist}
                        isDelegatedChecklist={!managedChecklist && !!delegatedChecklist}
                      />
                    </div>
                  </div>
                </div>
              )
            }
          </div>
        }
      </Main>
      <TaskModal isModalOpen={isModalOpen} closeModalHandler={closeModal} {...modalProps} />
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
