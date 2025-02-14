import { ChecklistSidebar } from '@components/checklist-sidebar/checklist-sidebar.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { Spinner } from '@sk-web-gui/spinner';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IntroductionPhaseMenu } from '@components/common/introduction-phase-menu/introduction-phase-menu.component';
import { IntroductionFulFillAllTasksCheckbox } from '@components/common/introduction-fulfill-all-tasks-checkbox/introduction-fulfill-all-tasks-checkbox.component';
import { IntroductionActivityList } from '@components/common/introduction-activity-list/introduction-activity-list.component';
import Breadcrumb from '@sk-web-gui/breadcrumb';
import { capitalize } from 'underscore.string';
import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';
import { getChecklistAsEmployee, getChecklistsAsManager } from '@services/checklist-service/checklist-service';
import { Tabs } from '@sk-web-gui/react';

export const CheckList: React.FC = () => {
  const router = useRouter();
  const { query } = router;

  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [currentView, setCurrentView] = useState<number>(0);
  const { t } = useTranslation();

  const [employeeIntroduction, setEmployeeIntroduction] = useState<EmployeeChecklist>();
  const [managerIntroduction, setManagerIntroduction] = useState<EmployeeChecklist>();

  useEffect(() => {
    getChecklistAsEmployee(query?.userId as string).then((res) => {
      setEmployeeIntroduction(res);
    });
  }, [query.userId]);

  useEffect(() => {
    employeeIntroduction &&
      getChecklistsAsManager(employeeIntroduction.manager.username).then((res) => {
        setManagerIntroduction(res.filter((employee) => employee.employee.username === query?.userId)[0]);
      });
  }, [employeeIntroduction]);

  const data = currentView === 0 ? managerIntroduction : employeeIntroduction;

  useEffect(() => {
    setCurrentPhase(0);
  }, [currentView]);

  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME}`}>
      <Main>
        {!data ?
          <Spinner className="my-80 mx-auto" />
        : <div>
            <div className="w-full">
              <Breadcrumb className="mb-40">
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="/admin/checklists">
                    {capitalize(t('common:introduction_other'))}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>

                <Breadcrumb.Item currentPage>
                  <Breadcrumb.Link href="#">
                    {t('common:introduction_of')} {data?.employee?.firstName} {data?.employee?.lastName}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>

            <h1 data-cy="admin-introduction-title" className="text-h1-md">
              {t('common:introduction_of')} {data?.employee?.firstName} {data?.employee?.lastName}
            </h1>

            <div className="flex gap-40 mt-40">
              <Tabs current={currentView}>
                <Tabs.Item>
                  <Tabs.Button onClick={() => setCurrentView(0)}>{t('templates:activities_for_manager')}</Tabs.Button>
                  <Tabs.Content className="w-full rounded bg-background-content border-1 border-divider">
                    <div>
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
                          readOnly={true}
                        />

                        <IntroductionActivityList
                          data={data}
                          currentView={currentView}
                          currentPhase={currentPhase}
                          isUserChecklist={true}
                          readOnly={true}
                        />
                      </div>
                    </div>
                  </Tabs.Content>
                </Tabs.Item>

                <Tabs.Item>
                  <Tabs.Button onClick={() => setCurrentView(1)}>{t('templates:activities_for_employee')}</Tabs.Button>
                  <Tabs.Content className="w-full rounded bg-background-content border-1 border-divider">
                    <div>
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
                          readOnly={true}
                        />

                        <IntroductionActivityList
                          data={data}
                          currentView={currentView}
                          currentPhase={currentPhase}
                          isUserChecklist={true}
                          readOnly={true}
                        />
                      </div>
                    </div>
                  </Tabs.Content>
                </Tabs.Item>
              </Tabs>

              <div className="pt-56 w-5/12">
                <ChecklistSidebar isUserChecklist={true} />
              </div>
            </div>
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
      'templates',
    ])),
  },
});

export default CheckList;
