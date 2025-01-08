import { Task } from '@data-contracts/backend/data-contracts';
import { removeCustomTask } from '@services/checklist-service/checklist-service';
import { useChecklist } from '@services/checklist-service/use-checklist';
import sanitized from '@services/sanitizer-service';
import { useUserStore } from '@services/user-service/user-service';
import LucideIcon, { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Button, Label, Link, PopupMenu, useConfirm } from '@sk-web-gui/react';
import { useTranslation } from 'next-i18next';
import React, { useState } from 'react';
import { shallow } from 'zustand/shallow';
import { AdminEditTaskModal } from '../admin-edit-task-modal/admin-edit-task-modal.component';
import { removeTask, useTemplate } from '@services/template-service/template-service';

interface AdminActivityListItemProps {
  task: Task;
  templateId: string;
  phaseId: string;
  index: number;
  items: number;
  moveUp: (task: Task) => void;
  moveDown: (task: Task) => void;
}

export const AdminActivityListItem: React.FC<AdminActivityListItemProps> = (props) => {
  const { task, templateId, phaseId, index, items, moveUp, moveDown } = props;
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { t } = useTranslation();
  const { refresh } = useTemplate(templateId);
  const confirm = useConfirm();

  const onRemoveTask = () => {
    removeTask(templateId, phaseId, task.id).then(() => {
      refresh(templateId);
    });
  };

  const openHandler = () => {
    setIsOpen(true);
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    <div className="w-full" data-cy={`activity-list-item-${index}`}>
      <div className="my-12 flex p-12">
        <div className="w-full flex items-start">
          <div className="flex gap-8">
            <Button
              iconButton
              data-cy="move-up"
              disabled={index === 0}
              inverted={index === 0}
              variant="tertiary"
              showBackground={false}
              size="sm"
              color="info"
              onClick={() => {
                moveUp(task);
              }}
            >
              <LucideIcon name="arrow-up" />
            </Button>
            <Button
              iconButton
              data-cy="move-down"
              disabled={index === items - 1}
              inverted={index === items - 1}
              variant="tertiary"
              showBackground={false}
              size="sm"
              color="info"
              onClick={() => {
                moveDown(task);
              }}
            >
              <LucideIcon name="arrow-down" />
            </Button>
          </div>
          <div className="pl-20 pr-80 w-full">
            <div className={task.fulfilmentStatus === 'TRUE' ? 'text-dark-disabled' : ''}>
              <span className="mr-3 mb-8 text-large" data-cy="task-heading">
                {task.headingReference ?
                  <Link external href={task.headingReference}>
                    {task.heading}
                  </Link>
                : task.heading}
              </span>
              <div className="pr-40 mb-16">
                <p>
                  <span
                    data-cy="task-text"
                    className="my-0 [&>ul]:list-disc [&>ol]:list-decimal [&>ul]:ml-lg [&>ol]:ml-lg [&>*>a]:underline"
                    dangerouslySetInnerHTML={{
                      __html: sanitized(task.text || '').replace('<a', "<a target='_blank'"),
                    }}
                  ></span>
                </p>
              </div>
              {['NEW_MANAGER', 'MANAGER_FOR_NEW_MANAGER'].includes(task.roleType) ?
                <div className="pr-40">
                  <Label color="vattjom" rounded inverted>
                    Aktivitet vid anställning av chef
                  </Label>
                </div>
              : null}
            </div>
          </div>
          <div>
            <div className=" flex flex-col items-center">
              <div className="relative w-min h-[3.2rem]">
                <PopupMenu>
                  <PopupMenu.Button
                    data-cy={`task-menu-button`}
                    iconButton
                    variant="tertiary"
                    size="sm"
                    showBackground={false}
                  >
                    <Icon name="ellipsis-vertical" />
                  </PopupMenu.Button>
                  <PopupMenu.Panel>
                    <PopupMenu.Items>
                      <PopupMenu.Item>
                        <Button
                          data-cy="activity-edit-button"
                          leftIcon={<Icon name="pen" />}
                          onClick={() => openHandler()}
                        >
                          {t('common:edit')}
                        </Button>
                      </PopupMenu.Item>
                      <PopupMenu.Item>
                        <Button
                          data-cy="activity-remove-button"
                          leftIcon={<Icon name="trash" />}
                          onClick={() =>
                            confirm
                              .showConfirmation(
                                t('task:remove_activity'),
                                t('task:remove_activity_text'),
                                t('common:remove'),
                                t('common:cancel'),
                                'error'
                              )
                              .then((confirmed) => {
                                if (confirmed) {
                                  onRemoveTask();
                                }
                              })
                          }
                          // onClick2={() => onRemoveTask()}
                        >
                          {t('common:remove')}
                        </Button>
                      </PopupMenu.Item>
                    </PopupMenu.Items>
                  </PopupMenu.Panel>
                </PopupMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && (
        <AdminEditTaskModal
          closeHandler={closeHandler}
          isOpen={isOpen}
          templateId={templateId}
          phaseId={phaseId}
          task={task}
        />
      )}
    </div>
  );
};
