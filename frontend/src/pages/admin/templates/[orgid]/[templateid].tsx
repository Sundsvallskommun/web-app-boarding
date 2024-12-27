import { AdminActivityListItem } from '@components/admin/admin-activity-list-item/admin-activity-list-item.component';
import { AdminEditTaskModal } from '@components/admin/admin-edit-task-modal/admin-edit-task-modal.component';
import LoaderFullScreen from '@components/loader/loader-fullscreen';
import {
  Checklist,
  SortorderRequest,
  Task,
  TaskCreateRequest,
  TaskUpdateRequest,
} from '@data-contracts/backend/data-contracts';
import { RoleType } from '@data-contracts/RoleType';
import AdminLayout from '@layouts/admin-layout/admin-layout.component';
import { setSortorder, useTemplate } from '@services/template-service/template-service';
import { getUser, useUserStore } from '@services/user-service/user-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Label, MenuBar } from '@sk-web-gui/react';
import { set } from 'cypress/types/lodash';
import dayjs from 'dayjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';
import { shallow } from 'zustand/shallow';

export const EditTemplate = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { templateid, orgid } = router.query;
  const user = useUserStore((s) => s.user, shallow);
  const { data, setData, refresh, loaded, loading } = useTemplate(templateid as string);
  const [currentView, setCurrentView] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [phaseId, setPhaseId] = useState<string>();
  const [lastSavedByName, setLastSavedByName] = useState<string>('');

  const openHandler = () => {
    setIsOpen(true);
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  const newTask: (
    roleType: 'NEW_EMPLOYEE' | 'NEW_MANAGER' | 'MANAGER_FOR_NEW_EMPLOYEE' | 'MANAGER_FOR_NEW_MANAGER'
  ) => Omit<Task, 'created' | 'updated' | 'lastSavedBy'> = (roleType) => {
    return {
      id: '',
      heading: '',
      headingReference: '',
      text: '',
      roleType,
      permission: 'ADMIN',
      questionType: 'YES_OR_NO',
      fulfilmentStatus: 'EMPTY',
      sortOrder: '0',
    };
  };

  const getSortorder = (checklist: Checklist) => {
    const order: SortorderRequest = {
      phaseOrder: checklist.phases?.map((phase, index) => ({
        id: phase.id,
        position: index + 1,
        taskOrder:
          phase.tasks
            // WHY IS SORTORDER NOT A NUMBER FOR TASKS WHEN IT IS FOR PHASES??
            ?.sort((a, b) => parseInt(a.sortOrder, 10) - parseInt(b.sortOrder, 10))
            .map((task, index) => ({
              id: task.id,
              position: index + 1,
            })) || [],
      })),
    };
    return order;
  };

  const moveUp = async (task: Task, checklist: Checklist) => {
    const thisPhase = checklist.phases?.find((phase) => phase.tasks?.some((t) => t.id === task.id));
    if (thisPhase) {
      const thisIndex = thisPhase?.tasks.findIndex((t) => t.id === task.id);
      let thisTask = thisPhase?.tasks[thisIndex as number];
      let previousTask = thisPhase?.tasks[(thisIndex as number) - 1];
      if (thisTask && previousTask) {
        thisPhase.tasks[thisIndex as number] = previousTask;
        thisPhase.tasks[(thisIndex as number) - 1] = thisTask;
      }
      setData({ ...checklist });
      // SAVING SORTORDER IS NOT WORKING
      // const newSortorder = getSortorder(checklist);
      // await setSortorder(orgid as string, newSortorder);
      // await refresh(templateid as string);
    }
  };

  const moveDown = async (task: Task, checklist: Checklist) => {
    const thisPhase = checklist.phases?.find((phase) => phase.tasks?.some((t) => t.id === task.id));
    if (thisPhase) {
      const thisIndex = thisPhase?.tasks.findIndex((t) => t.id === task.id);
      const thisTask = thisPhase?.tasks[thisIndex as number];
      const nextTask = thisPhase?.tasks[(thisIndex as number) + 1];
      if (thisTask && nextTask) {
        thisPhase.tasks[thisIndex as number] = nextTask;
        thisPhase.tasks[(thisIndex as number) + 1] = thisTask;
      }
      setData({ ...checklist });
      // SAVING SORTORDER IS NOT WORKING
      // const newSortorder = getSortorder(checklist);
      // await setSortorder(orgid as string, newSortorder);
      // await refresh(templateid as string);
    }
  };

  const filteredTasks = useCallback(
    (data: Checklist, roleTypes: string[]) => {
      console.log('calculating filtered tasks');
      return (
        data?.phases
          // ?.filter((phase) => phase.tasks?.some((task) => roleTypes.includes(task.roleType)))
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((phase, index) => (
            <div key={phase.id} className="py-20 px-20 mb-48" data-cy={`phase-section-${index}`}>
              <h3 className="mb-12 text-h3-md"> {phase.name}</h3>
              <ol className="w-full pl-8 list-decimal">
                {phase.tasks
                  ?.filter((task) => roleTypes.includes(task.roleType))
                  .map((task, index, list) => (
                    <AdminActivityListItem
                      key={task.id}
                      task={task}
                      templateId={data.id}
                      phaseId={phase.id}
                      index={index}
                      items={list.length}
                      moveUp={(task: Task) => moveUp(task, data)}
                      moveDown={(task: Task) => moveDown(task, data)}
                    />
                  ))}
              </ol>
              <Button
                size="lg"
                className="mt-8 ml-24"
                data-cy={`add-activity-button`}
                leftIcon={<LucideIcon name="plus" />}
                variant="tertiary"
                color="info"
                onClick={() => {
                  setPhaseId(phase.id);
                  setIsOpen(true);
                }}
              >
                {t('task:add_activity')}
              </Button>
            </div>
          ))
      );
    },
    [data]
  );

  useEffect(() => {
    if (!data?.lastSavedBy) {
      setLastSavedByName('');
    } else {
      getUser(data?.lastSavedBy).then((user) => {
        const name = `${user.data?.givenname || ''} ${user.data?.lastname || ''}`;
        setLastSavedByName(name);
      });
    }
  }, [data]);

  return (
    <AdminLayout
      title={`${t('common:title')} - ${t('common:admin')}`}
      headerTitle={`${t('common:title')} - ${t('common:admin')}`}
    >
      {loading ?
        <LoaderFullScreen />
      : <div className="max-w-[104rem]">
          <h2 className="text-h3-sm md:text-h3-md xl:text-h3-lg m-0 mb-24">{capitalize(data?.displayName || '')}</h2>
          {loaded && (
            <>
              <div className="flex gap-40 mb-24 text-small">
                <div>
                  <span className="font-bold">{t('templates:properties.updated_by')}</span> {lastSavedByName} (
                  {data?.lastSavedBy}) {dayjs(data?.updated).format('YYYY-MM-DD, HH:mm')}
                </div>
                <div>
                  <span className="font-bold">{t('templates:properties.version')}</span> {data?.version}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <MenuBar current={currentView} className="w-full">
                  <MenuBar.Item data-cy={`template-menu-bar-item-0`}>
                    <Button onClick={() => setCurrentView(0)}>Chef</Button>
                  </MenuBar.Item>
                  <MenuBar.Item data-cy={`template-menu-bar-item-1`}>
                    <Button onClick={() => setCurrentView(1)}>Anställd</Button>
                  </MenuBar.Item>
                </MenuBar>
                <Label
                  className="mx-md"
                  color={
                    data?.lifeCycle === 'ACTIVE' ? 'gronsta'
                    : data?.lifeCycle === 'CREATED' ?
                      'vattjom'
                    : 'juniskar'
                  }
                >
                  {data?.lifeCycle === 'ACTIVE' ?
                    t('templates:active')
                  : data?.lifeCycle === 'CREATED' ?
                    t('templates:created')
                  : t('templates:deprecated')}
                </Label>
              </div>
              <div className="w-full rounded-16 bg-white shadow-custom border-divider pb-24">
                {currentView === 0 ?
                  data && filteredTasks(data, [RoleType.MANAGER_FOR_NEW_EMPLOYEE, RoleType.MANAGER_FOR_NEW_MANAGER])
                : data && filteredTasks(data, [RoleType.NEW_EMPLOYEE, RoleType.NEW_MANAGER])}
              </div>
            </>
          )}
        </div>
      }
      {isOpen && phaseId && (
        <AdminEditTaskModal
          closeHandler={closeHandler}
          isOpen={isOpen}
          templateId={templateid as string}
          phaseId={phaseId}
          task={newTask(currentView === 0 ? 'MANAGER_FOR_NEW_EMPLOYEE' : 'NEW_EMPLOYEE')}
        />
      )}
    </AdminLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, [
      'common',
      'example',
      'layout',
      'admin',
      'checklists',
      'task',
      'templates',
    ])),
  },
});

export default EditTemplate;
