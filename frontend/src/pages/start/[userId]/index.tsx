import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { Link, Button, MenuBar } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { ActivityListItem } from '@components/activity-list-item/activity-list-item.component';
import { Stepper } from '@components/stepper/stepper.component';
import { getChecklistAsEmployee, getChecklistsAsManager } from '@services/checklist-service/checklist-service';
import { useAppContext } from '@contexts/app.context';
import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';
import { Spinner } from '@sk-web-gui/spinner';
import { ChecklistHeader } from '@components/checklist-header/checklist-header.component';
import Divider from '@sk-web-gui/divider';
import { useUserStore } from '@services/user-service/user-service';
import { shallow } from 'zustand/shallow';

export const CheckList: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const router = useRouter();
  const { asEmployeeChecklists, setAsEmployeeChecklists, asManagerChecklists, setAsManagerChecklists } =
    useAppContext();

  const [data, setData] = useState<EmployeeChecklist>(asManagerChecklists[0]);
  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [currentView, setCurrentView] = useState<number>(0);

  useEffect(() => {
    const { query } = router;
    if (query?.userId) {
      getChecklistAsEmployee(query.userId?.toString()).then((res) => {
        setAsEmployeeChecklists(res);
      });
      getChecklistsAsManager(user.username).then((res) => setAsManagerChecklists(res));
    }
  }, [router]);

  useEffect(() => {
    if (currentView === 0) {
      setData(asManagerChecklists[0]);
    } else {
      setData(asEmployeeChecklists);
    }
  }, [currentView, asManagerChecklists, asEmployeeChecklists]);

  useEffect(() => {
    setCurrentPhase(0);
  }, [currentView]);

  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME}`}>
      <Main>
        <div className="p-8">
          {!data ?
            <Spinner />
          : <div>
              <ChecklistHeader />
              <Divider />
              <MenuBar className="my-32 px-0 m-0 gap-8" current={currentView}>
                <MenuBar.Item>
                  <Button onClick={() => setCurrentView(0)}>Min checklista</Button>
                </MenuBar.Item>

                <MenuBar.Item>
                  <Button onClick={() => setCurrentView(1)}>Medarbetarens checklista</Button>
                </MenuBar.Item>
              </MenuBar>

              <div className="w-full rounded bg-white border-1 border-divider py-24 pl-40 flex">
                <div className="w-2/3">
                  <h2 className="mb-24"> {data.phases[currentPhase].name}</h2>
                  <p className="w-9/12 mb-16">
                    En rekommendation är att du följer upp introduktionen minst en gång i månaden för att se hur din
                    medarbetare trivs och kommit in i arbetet.
                  </p>

                  {data.phases[currentPhase].tasks.map((task) => {
                    if (currentView === 0) {
                      if (task.roleType === 'MANAGER_FOR_NEW_EMPLOYEE' || 'MANAGER_FOR_NEW_MANAGER') {
                        return (
                          <ActivityListItem
                            key={task.id}
                            task={task}
                            checklistId={data.id}
                            employee={data.employee.username}
                          />
                        );
                      }
                    } else {
                      if (task.roleType === 'NEW_EMPLOYEE' || 'NEW_MANAGER') {
                        return (
                          <ActivityListItem
                            key={task.id}
                            task={task}
                            checklistId={data.id}
                            employee={data.employee.username}
                          />
                        );
                      }
                    }
                  })}
                </div>

                <div className="py-24 mx-auto">
                  <Stepper
                    data={data}
                    currentView={currentView}
                    currentPhase={currentPhase}
                    setCurrentPhase={setCurrentPhase}
                  />
                </div>
              </div>
            </div>
          }

          {user ?
            <NextLink href={`/logout`}>
              <Link as="span" variant="link">
                Logga ut
              </Link>
            </NextLink>
          : ''}
        </div>
      </Main>
    </DefaultLayout>
  );
};

export default CheckList;
