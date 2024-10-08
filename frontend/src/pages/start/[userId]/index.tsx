import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useUserStore } from '@services/user-service/user-service';
import { Link, Button, MenuBar } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { shallow } from 'zustand/shallow';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { AddActivityModal } from '@components/add-activity-modal/add-activity-modal.component';
import { ActivityListItem } from '@components/activity-list-item/activity-list-item.component';
import { Stepper } from '@components/stepper/stepper.component';

const tableData = [
  {
    title: 'Inför första dagen',
    endDate: '11 mars 2024',
    status: 'done',
    tasks: [
      {
        linkTitle: 'Inför första dagen',
        linkUrl: '#',
        description:
          'Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1',
        done: true,
        labelText: 'Chefsaktivitet',
        type: 'checkbox',
      },
      {
        linkTitle: 'Uppgift 2',
        linkUrl: null,
        description: 'Beskrivning 2',
        done: false,
        labelText: 'Chefsaktivitet',
        type: 'checkbox',
      },
      {
        linkTitle: 'Something something 2',
        linkUrl: '#',
        description: 'Beskrivning 2',
        done: true,
        labelText: null,
        type: 'checkbox',
      },
    ],
  },
  {
    title: 'Första dagen',
    endDate: '12 mars 2024',
    status: 'done',
    tasks: [
      {
        linkTitle: 'Första dagen',
        linkUrl: '#',
        description:
          'Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1',
        done: true,
        labelText: '',
        type: 'checkbox',
      },
      {
        linkTitle: 'Uppgift 4',
        linkUrl: '#',
        description: 'Beskrivning 2',
        done: true,
        labelText: 'Chefsaktivitet',
        type: 'checkbox',
      },
      {
        linkTitle: 'Hjälpmedelsförskrivning',
        linkUrl: '#',
        description: 'Beskrivning 2',
        done: true,
        labelText: 'Chefsaktivitet',
        type: 'checkbox',
      },
    ],
  },
  {
    title: 'Första veckan',
    endDate: '12 mars 2024',
    status: 'none',
    tasks: [
      {
        linkTitle: 'Första veckan',
        linkUrl: '#',
        description:
          'Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1',
        done: false,
        labelText: 'Chefsaktivitet',
        type: 'checkbox',
      },
      {
        linkTitle: 'Uppgift 6',
        linkUrl: null,
        description: 'Beskrivning 2',
        done: false,
        labelText: '',
        type: 'checkbox',
      },
      {
        linkTitle: 'Hjälpmedelsförskrivning',
        linkUrl: '#',
        description: 'Beskrivning 2',
        done: false,
        labelText: 'Chefsaktivitet',
        type: 'checkbox',
      },
      {
        linkTitle: 'Hjälpmedelsförskrivning',
        linkUrl: '#',
        description: 'Beskrivning 2',
        done: false,
        labelText: 'Chefsaktivitet',
        type: 'checkbox',
      },
    ],
  },
  {
    title: 'Uppföljning',
    endDate: '12 mars 2024',
    status: 'started',
    tasks: [
      {
        linkTitle: 'Uppföljning',
        linkUrl: '#',
        description:
          'Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1',
        done: false,
        labelText: 'Chefsaktivitet',
        type: 'checkbox',
      },
      {
        linkTitle: 'Uppgift 8',
        linkUrl: '#',
        description: 'Beskrivning 2',
        done: false,
        labelText: 'Chefsaktivitet',
        type: 'checkbox',
      },
      {
        linkTitle: 'Hur trivs medarbetaren på arbetsplatsen/i arbetsgruppen?',
        linkUrl: '',
        description: null,
        done: true,
        labelText: null,
        type: 'textfield',
      },
      {
        linkTitle: 'Hur trivs medarbetaren på arbetsplatsen/i arbetsgruppen?',
        linkUrl: null,
        description: null,
        done: true,
        labelText: null,
        type: 'textfield',
      },
    ],
  },
];

const employeeTableData = [
  {
    title: 'Första dagen',
    endDate: '12 mars 2024',
    status: 'done',
    tasks: [
      {
        linkTitle: 'Första dagen',
        linkUrl: '#',
        description:
          'Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1',
        done: true,
        labelText: '',
        type: 'checkbox',
      },
    ],
  },
  {
    title: 'Första veckan',
    endDate: '12 mars 2024',
    status: 'none',
    tasks: [
      {
        linkTitle: 'Första veckan',
        linkUrl: '#',
        description:
          'Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1',
        done: false,
        labelText: 'Chefsaktivitet',
        type: 'checkbox',
      },
    ],
  },
  {
    title: 'Uppföljning',
    endDate: '12 mars 2024',
    status: 'started',
    tasks: [
      {
        linkTitle: 'Uppföljning',
        linkUrl: '#',
        description:
          'Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1, Beskrivning 1',
        done: false,
        labelText: 'Chefsaktivitet',
        type: 'checkbox',
      },
    ],
  },
];

export const CheckList: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  console.log('user', user);

  const router = useRouter();

  const [currentPhase, setCurrentPhase] = useState<number>(0);
  const [currentView, setCurrentView] = useState<number>(0);
  const [data, setData] = useState<any>(tableData);

  useEffect(() => {
    if (currentView == 0) {
      setData(tableData);
      setCurrentPhase(0);
    } else {
      setData(employeeTableData);
      setCurrentPhase(0);
    }
  }, [currentView]);

  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - Name of user`}>
      <Main>
        <div className="p-8">
          <div className="flex">
            <div className="w-1/2 pt-10 pb-24">
              <h2>Anna Andersson (ann21and)</h2>
            </div>

            <div className="flex w-1/2 gap-14 justify-end">
              <div className="flex gap-16">
                <p className="pt-4">
                  Delegerad till <b>Lisa Nilsson</b>
                </p>
                <Button className="bg-tertiary-surface">Ta bort</Button>
              </div>

              <div>
                <AddActivityModal />
              </div>
            </div>
          </div>

          <div>
            <MenuBar className="pb-24 px-0 m-0 gap-8" current={currentView}>
              <MenuBar.Item>
                <Button onClick={() => setCurrentView(0)}>Min checklista</Button>
              </MenuBar.Item>

              <MenuBar.Item>
                <Button onClick={() => setCurrentView(1)}>Medarbetarens checklista</Button>
              </MenuBar.Item>
            </MenuBar>

            <div className="w-full rounded bg-white border-1 border-divider py-24 pl-40 flex">
              <div className="w-2/3">
                <h2 className="mb-24">{data[currentPhase].title}</h2>
                <p className="w-9/12 mb-16">
                  En rekommendation är att du följer upp introduktionen minst en gång i månaden för att se hur din
                  medarbetare trivs och kommit in i arbetet.
                </p>

                {data[currentPhase].tasks.map((task, index) => {
                  return <ActivityListItem key={index} task={task} />;
                })}
              </div>

              <div className="py-24 mx-auto">
                <Stepper data={data} currentPhase={currentPhase} setCurrentPhase={setCurrentPhase} />
              </div>
            </div>
          </div>

          {user.name ?
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
