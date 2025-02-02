import { AddActivityModal } from '@components/add-activity-modal/add-activity-modal.component';
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
import { useShallow } from 'zustand/react/shallow';
import { useDelegatedChecklists } from '@services/checklist-service/use-delegated-checklists';
import { useTranslation } from 'react-i18next';
import { IntroductionPhaseMenu } from '@components/common/introduction-phase-menu/introduction-phase-menu.component';
import { IntroductionViewToggle } from '@components/common/introduction-view-toggle/introduction-view-toggle.component';
import { IntroductionFulFillAllTasksCheckbox } from '@components/common/introduction-fulfill-all-tasks-checkbox/introduction-fulfill-all-tasks-checkbox.component';
import { IntroductionActivityList } from '@components/common/introduction-activity-list/introduction-activity-list.component';

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

  const { data: managedChecklists } = useManagedChecklists();
  const { data: employeeChecklist, loaded } = useChecklist((query?.userId as string) || username);
  const { data: delegatedChecklists } = useDelegatedChecklists();

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

                      {(managedChecklists || delegatedChecklist) && <AddActivityModal />}
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
