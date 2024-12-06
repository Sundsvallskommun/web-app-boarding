import { EmployeeChecklistTask } from '@data-contracts/backend/data-contracts';
import { removeCustomTask, updateTaskFulfilmentStatus } from '@services/checklist-service/checklist-service';
import { useManagedChecklists } from '@services/checklist-service/use-managed-checklists';
import sanitized from '@services/sanitizer-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button, Checkbox, Label, PopupMenu } from '@sk-web-gui/react';
import { shallow } from 'zustand/shallow';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import React, { useState } from 'react';
import { EditTaskModal } from '@components/edit-task-modal/edit-task-modal.component';
import { useTranslation } from 'next-i18next';
import { useChecklist } from '@services/checklist-service/use-checklist';

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
}

export const ActivityListItem: React.FC<ActivityListItemProps> = (props) => {
  const user = useUserStore((s) => s.user, shallow);
  const { task, checklistId, currentView } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const { refresh: refreshManagedChecklists } = useManagedChecklists();
  const { refresh: refreshChecklist } = useChecklist();

  const updateTaskFulfilment = (newFulfilmentStatus: string) => {
    updateTaskFulfilmentStatus(checklistId, task.id, newFulfilmentStatus, user.username).then(() => {
      if (currentView === 0) {
        refreshManagedChecklists();
      } else {
        refreshChecklist();
      }
    });
  };

  const removeTask = () => {
    removeCustomTask(checklistId, task.id).then(() => {
      refreshManagedChecklists();
      refreshChecklist();
    });
  };

  const openHandler = () => {
    setIsOpen(true);
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    <div>
      <div className="my-4 flex p-16">
        <div className="w-full mt-8 flex items-start">
          <Checkbox
            checked={isChecked(task.fulfilmentStatus)}
            value={task.fulfilmentStatus}
            className="pr-3"
            onChange={() => {
              updateTaskFulfilment(task.fulfilmentStatus === 'TRUE' ? 'FALSE' : 'TRUE');
            }}
          />
          <div className="pl-20 pr-80 w-full">
            <div className={task.fulfilmentStatus === 'TRUE' ? 'text-dark-disabled' : ''}>
              <span className="mr-3 text-large">{task.heading}</span>
              <div className="pr-40">
                <p>
                  <span
                    className="my-0 [&>ul]:list-disc [&>ol]:list-decimal [&>ul]:ml-lg [&>ol]:ml-lg"
                    dangerouslySetInnerHTML={{
                      __html: sanitized(task.text),
                    }}
                  ></span>
                </p>
              </div>

              {task.customTask && (
                <Label className="mt-4" rounded inverted>
                  Egen aktivitet
                </Label>
              )}
            </div>
          </div>
          <div>
            {task.customTask && (
              <div className=" flex flex-col items-center">
                <div className="relative w-min h-[3.2rem]">
                  <PopupMenu>
                    <PopupMenu.Button iconButton variant="tertiary" size="sm" showBackground={false}>
                      <Icon name="ellipsis-vertical" />
                    </PopupMenu.Button>
                    <PopupMenu.Panel>
                      <PopupMenu.Items>
                        <PopupMenu.Item>
                          <Button leftIcon={<Icon name="pen" />} onClick={() => openHandler()}>
                            {t('common:edit')}
                          </Button>
                        </PopupMenu.Item>
                        <PopupMenu.Item>
                          <Button leftIcon={<Icon name="trash" />} onClick={() => removeTask()}>
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
      {isOpen && <EditTaskModal closeHandler={closeHandler} isOpen={isOpen} checklistId={checklistId} task={task} />}
    </div>
  );
};
