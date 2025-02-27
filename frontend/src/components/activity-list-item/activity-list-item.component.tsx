import { TaskModal, TaskModalProps } from '@components/task-modal/task-modal.component';
import { EmployeeChecklistTask } from '@data-contracts/backend/data-contracts';
import { removeCustomTask, updateTaskFulfilmentStatus } from '@services/checklist-service/checklist-service';
import sanitized from '@services/sanitizer-service';
import { useUserInformation } from '@services/user-service/use-user-information';
import { useUserStore } from '@services/user-service/user-service';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Button, Checkbox, Label, PopupMenu } from '@sk-web-gui/react';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { shallow } from 'zustand/shallow';

const isChecked = (fulfilmentStatus: string) => {
  switch (fulfilmentStatus) {
    case 'EMPTY':
      return false;
    case 'FALSE':
      return false;
    case 'TRUE':
      return true;
    default:
      return false;
  }
};
interface ActivityListItemProps {
  task: EmployeeChecklistTask;
  checklistId: string;
  currentView: number;
  isUserChecklist: boolean;
  managerUsername?: string;
  refreshAllChecklists: () => Promise<[void, void, void]>;
}

export const ActivityListItem: React.FC<ActivityListItemProps> = (props) => {
  const user = useUserStore((s) => s.user, shallow);
  const { task, checklistId, currentView, isUserChecklist, managerUsername } = props;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);
  const { t } = useTranslation();
  const { data: userInformation } = useUserInformation(task.updatedBy);

  const updateTaskFulfilment = (newFulfilmentStatus: string) => {
    updateTaskFulfilmentStatus(checklistId, task.id, newFulfilmentStatus, user.username).then(async () => {
      return await props.refreshAllChecklists();
    });
  };

  const removeTask = async () => {
    try {
      await removeCustomTask(checklistId, task.id);
      await props.refreshAllChecklists();
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  return (
    <div className="my-8">
      <div className="flex p-16 hover:bg-background-200 rounded-button">
        <div className="w-full flex items-start">
          <Checkbox
            data-cy={`id-${task.id}`}
            checked={isChecked(task.fulfilmentStatus)}
            value={task.fulfilmentStatus}
            className="pr-3"
            onChange={() => {
              updateTaskFulfilment(task.fulfilmentStatus === 'TRUE' ? 'FALSE' : 'TRUE');
            }}
          />
          <div className="pl-20 pr-80 w-full">
            <div className={task.fulfilmentStatus === 'TRUE' ? 'text-dark-disabled' : ''}>
              {task.headingReference ?
                <>
                  <a className="text-large underline mr-4" href={task.headingReference} target="_blank">
                    {task.heading}
                  </a>
                  <Icon size="1.5rem" name="external-link" />
                </>
              : <span className="mr-3 text-large">{task.heading}</span>}
              <div className="pr-40">
                <p>
                  <span
                    className="my-0 [&>ul]:list-disc [&>ol]:list-decimal [&>ul]:ml-lg [&>ol]:ml-lg [&>*>a]:underline"
                    dangerouslySetInnerHTML={{
                      __html: sanitized(task.text || '').replace('<a', "<a target='_blank'"),
                    }}
                  ></span>
                </p>
              </div>

              {task.customTask && (
                <Label className="mt-4" rounded inverted>
                  Egen aktivitet
                </Label>
              )}
              {task.fulfilmentStatus === 'TRUE' && (
                <p className="text-small text-primary mt-16">
                  <Icon className="align-middle mr-5" name="check" size="1.5rem" />
                  {t('task:fulfilled_by', {
                    user: userInformation?.map((userInfo) => {
                      if (userInfo.username === task.updatedBy) {
                        return userInfo.name;
                      } else {
                        return task.updatedBy;
                      }
                    }),
                  })}
                </p>
              )}
            </div>
          </div>
          <div>
            {task.customTask && !isUserChecklist && (
              <div className=" flex flex-col items-center">
                <div className="relative w-min h-[3.2rem]">
                  <PopupMenu>
                    <PopupMenu.Button
                      iconButton
                      variant="tertiary"
                      size="sm"
                      showBackground={false}
                      data-cy="edit-custom-activity-popup-menu"
                    >
                      <Icon name="ellipsis-vertical" />
                    </PopupMenu.Button>
                    <PopupMenu.Panel>
                      <PopupMenu.Items>
                        <PopupMenu.Item>
                          <Button
                            leftIcon={<Icon name="pen" />}
                            onClick={openModal}
                            data-cy="edit-custom-activity-popup-menu-edit-button"
                          >
                            {t('common:edit')}
                          </Button>
                        </PopupMenu.Item>
                        <PopupMenu.Item>
                          <Button
                            leftIcon={<Icon name="trash" />}
                            onClick={() => removeTask()}
                            data-cy="edit-custom-activity-popup-menu-remove-button"
                          >
                            {t('common:remove')}
                          </Button>
                        </PopupMenu.Item>
                      </PopupMenu.Items>
                    </PopupMenu.Panel>
                  </PopupMenu>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {isModalOpen && (
        <TaskModal
          isModalOpen={isModalOpen}
          closeModalHandler={closeModal}
          mode="edit"
          task={task}
          checklistId={checklistId}
          currentView={currentView}
          data={null}
          newSortOrder={task.sortOrder}
        />
      )}
    </div>
  );
};
