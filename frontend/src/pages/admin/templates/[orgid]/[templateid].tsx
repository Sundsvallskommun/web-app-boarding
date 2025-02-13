import { AdminActivityListItem } from '@components/admin/admin-activity-list-item/admin-activity-list-item.component';
import { AdminEditTaskModal } from '@components/admin/admin-edit-task-modal/admin-edit-task-modal.component';
import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { Checklist, SortorderRequest, Task, User } from '@data-contracts/backend/data-contracts';
import { RoleType } from '@data-contracts/RoleType';
import AdminLayout from '@layouts/admin-layout/admin-layout.component';
import { useOrgTemplates, useOrgTreeStore } from '@services/organization-service';
import {
  activateTemplate,
  createNewVersion,
  setSortorder,
  useTemplate,
} from '@services/template-service/template-service';
import { getUser, useUserStore } from '@services/user-service/user-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Label, MenuBar, useConfirm, useSnackbar, Tabs } from '@sk-web-gui/react';
import { findOrgInTree } from '@utils/find-org-in-tree';
import dayjs from 'dayjs';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';
import { AdminTemplateSidebar } from '@components/admin/admin-template-sidebar/admin-template-sidebar.component';
import { templateVersioningEnabled } from '@services/featureflag-service';
import { shallow } from 'zustand/shallow';

export const EditTemplate = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { templateid, orgid } = router.query;
  const { data, refresh, loaded, loading } = useTemplate(templateid as string);
  const { data: orgTreeData } = useOrgTreeStore();
  const { data: orgData } = useOrgTemplates(parseInt(orgid as string, 10));
  const user = useUserStore((s) => s.user, shallow);
  const [currentView, setCurrentView] = useState<number>(0);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [phaseId, setPhaseId] = useState<string>();
  const [lastSavedByName, setLastSavedByName] = useState<string>('');
  const confirm = useConfirm();
  const toastMessage = useSnackbar();
  const org = findOrgInTree(Object.values(orgTreeData), parseInt(orgid as string, 10));
  const [phaseIndex, setPhaseIndex] = useState<number>(0);

  const editable = useCallback(
    (checklist: Checklist, user: User) => {
      const userHasOrgPermission =
        user.role === 'department_admin' && user.children.includes(parseInt(orgid as string, 10));
      const userIsGlobalAdmin = user.role === 'global_admin';
      const editableLifeCycle =
        checklist.lifeCycle === 'CREATED' || (!templateVersioningEnabled && checklist.lifeCycle === 'ACTIVE');
      return (userHasOrgPermission || userIsGlobalAdmin) && editableLifeCycle;
    },
    [data, user]
  );

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
      sortOrder: data && org ? (1000 * org?.treeLevel + data.phases[phaseIndex].tasks.length + 1).toString() : '0',
    };
  };

  const getSortorder = (checklist: Checklist) => {
    const org = findOrgInTree(Object.values(orgTreeData), parseInt(orgid as string, 10));
    const level = org?.treeLevel || 0;
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
              position: 1000 * level + index + 1,
            })) || [],
      })),
    };
    return order;
  };

  async function moveTask(task: Task, checklist: Checklist, offset: -1 | 1) {
    const phaseIndex = checklist.phases?.findIndex((phase) => phase.tasks?.some((t) => t.id === task.id));
    if (phaseIndex == null || phaseIndex < 0) return;

    const thisPhase = { ...checklist.phases[phaseIndex] };
    if (!thisPhase.tasks) return;

    const thisIndex = thisPhase.tasks.findIndex((t) => t.id === task.id);
    if (thisIndex < 0) return;

    const partnerIndex = thisIndex + offset;
    if (partnerIndex < 0 || partnerIndex >= thisPhase.tasks.length) return;

    const thisTask = { ...thisPhase.tasks[thisIndex] };
    const otherTask = { ...thisPhase.tasks[partnerIndex] };
    const tempOrder = thisTask.sortOrder;
    thisTask.sortOrder = otherTask.sortOrder;
    otherTask.sortOrder = tempOrder;
    thisPhase.tasks[thisIndex] = otherTask;
    thisPhase.tasks[partnerIndex] = thisTask;
    checklist.phases[phaseIndex] = thisPhase;

    const newSortorder = getSortorder(checklist);
    await setSortorder(orgid as string, checklist.id, newSortorder);
    await refresh(templateid as string);
  }

  const moveUp = (task: Task, checklist: Checklist) => moveTask(task, checklist, -1);

  const moveDown = (task: Task, checklist: Checklist) => moveTask(task, checklist, 1);

  const onActivate = () => {
    confirm
      .showConfirmation(
        t('templates:activate.title'),
        t('templates:activate.text'),
        t('templates:activate.confirm'),
        t('common:cancel'),
        'error'
      )
      .then((confirmed) => {
        if (confirmed && data) {
          activateTemplate(orgid as string, data.id)
            .then(() => {
              refresh(templateid as string);
              closeHandler();
            })
            .catch(() => {
              toastMessage({
                position: 'bottom',
                closeable: false,
                message: t('templates:activate.error'),
                status: 'error',
              });
            });
        }
      });
  };

  const onNewVersion = () => {
    confirm
      .showConfirmation(
        t('templates:new_version.title'),
        t('templates:new_version.text'),
        t('templates:new_version:confirm'),
        t('common:cancel'),
        'error'
      )
      .then((confirmed) => {
        if (confirmed && data) {
          createNewVersion(orgid as string, data.id)
            .then((checklist) => {
              router.push(`/admin/templates/${orgid}/${checklist?.id}`);
              closeHandler();
            })
            .catch(() => {
              toastMessage({
                position: 'bottom',
                closeable: false,
                message: t('templates:new_version.error'),
                status: 'error',
              });
            });
        }
      });
  };

  const filteredTasks = useCallback(
    (checklist: Checklist, roleTypes: string[]) => {
      return checklist?.phases
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
                    templateId={checklist.id}
                    phaseId={phase.id}
                    index={index}
                    items={list.length}
                    moveUp={(task: Task) => moveUp(task, checklist)}
                    moveDown={(task: Task) => moveDown(task, checklist)}
                    editable={editable(checklist, user)}
                  />
                ))}
            </ol>
            {editable(checklist, user) ?
              <Button
                size="lg"
                className="mt-8 ml-24"
                data-cy={`add-activity-button`}
                leftIcon={<LucideIcon name="plus" />}
                variant="tertiary"
                showBackground={false}
                color="info"
                onClick={() => {
                  setPhaseIndex(index);
                  setPhaseId(phase.id);
                  setIsOpen(true);
                }}
              >
                {t('task:create.title')}
              </Button>
            : null}
          </div>
        ));
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
      {loading || !data ?
        <LoaderFullScreen />
      : <div className="flex w-full">
          <div className="w-full pt-40">
            <h2 data-cy="template-name" className="text-h3-sm md:text-h3-md xl:text-h3-lg m-0 mb-24">
              {capitalize(data?.displayName || '')}
            </h2>
            {loaded && (
              <>
                <div>
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
                    <Tabs
                      current={currentView}
                      className="flex flex-col justify-center items-start"
                      data-cy="template-tab-bar"
                    >
                      <Tabs.Item data-cy={`template-tabs-bar-item-0`}>
                        <Tabs.Button
                          className="w-full"
                          data-cy={`template-tabs-bar-button-0`}
                          onClick={() => setCurrentView(0)}
                        >
                          {t('templates:activities_for_manager')}
                        </Tabs.Button>
                        <Tabs.Content></Tabs.Content>
                      </Tabs.Item>

                      <Tabs.Item data-cy={`template-tabs-bar-item-1`}>
                        <Tabs.Button
                          className="w-full"
                          data-cy={`template-tabs-bar-button-1`}
                          onClick={() => setCurrentView(1)}
                        >
                          {t('templates:activities_for_employee')}
                        </Tabs.Button>
                        <Tabs.Content></Tabs.Content>
                      </Tabs.Item>
                    </Tabs>
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
                    {editable(data, user) && data?.lifeCycle === 'CREATED' ?
                      <Button size="sm" color="vattjom" onClick={onActivate}>
                        {t('templates:activate.confirm')}
                      </Button>
                    : (
                      editable(data, user) &&
                      templateVersioningEnabled &&
                      data?.lifeCycle === 'ACTIVE' &&
                      orgData?.checklists?.filter((c) => c.lifeCycle === 'CREATED').length === 0
                    ) ?
                      <Button size="sm" color="vattjom" onClick={onNewVersion}>
                        {t('templates:new_version.confirm')}
                      </Button>
                    : null}
                  </div>
                  <div className="w-full rounded-16 bg-background-content shadow-custom border-divider pb-24">
                    {currentView === 0 ?
                      data && filteredTasks(data, [RoleType.MANAGER_FOR_NEW_EMPLOYEE, RoleType.MANAGER_FOR_NEW_MANAGER])
                    : data && filteredTasks(data, [RoleType.NEW_EMPLOYEE, RoleType.NEW_MANAGER])}
                  </div>
                </div>
              </>
            )}
          </div>
          <AdminTemplateSidebar currentView={currentView} />
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
