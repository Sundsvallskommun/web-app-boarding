import { AssignMentorModal } from '@components/assign-mentor-modal/assign-mentor-modal.component';
import { DelegateMultipleChecklistsModal } from '@components/delegate-checklists-modal/delegate-checklists-modal.component';
import { removeDelegation } from '@services/checklist-service/checklist-service';
import { useChecklist } from '@services/checklist-service/use-checklist';
import { useManagedChecklists } from '@services/checklist-service/use-managed-checklists';
import { useUserStore } from '@services/user-service/user-service';
import { Avatar } from '@sk-web-gui/avatar';
import Divider from '@sk-web-gui/divider';
import { Link } from '@sk-web-gui/link';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Button } from '@sk-web-gui/react';
import { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

export const ChecklistSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    permissions: { isManager },
  } = useUserStore(useShallow((state) => state.user));

  const { refresh, data } = useChecklist();
  const { refresh: refreshManagedChecklists } = useManagedChecklists();

  const openHandler = () => {
    setIsOpen(true);
  };

  const onUpdate = () => {
    refresh();
    refreshManagedChecklists();
  };

  const closeHandler = () => {
    onUpdate();
    setIsOpen(false);
  };

  return (
    data && (
      <div className="rounded bg-white border-1 border-divider py-8 px-24">
        <div className="my-8">
          <strong>{`${data.employee.firstName} ${data.employee.lastName} (${data.employee.username})`}</strong>
          <p className="text-small my-0">{data.employee.title ? data.employee.title : ''}</p>
        </div>

        <div className="my-8">
          <strong>Anställningsdatum</strong>
          <p className="text-small">{data.startDate}</p>
        </div>

        {isManager ?
          <>
            <Divider className="my-24" />

            <div className="my-16">
              <strong>Mentor</strong>
              <AssignMentorModal />
            </div>

            <div className="my-16">
              <strong>Delegerad till</strong>
              {data.delegatedTo?.map((delegation, index) => {
                return (
                  <div key={index} className="mt-8">
                    <Avatar size="sm" className="mr-4" rounded /> {delegation}
                    <Button
                      iconButton
                      name="trash"
                      size="sm"
                      inverted
                      onClick={() => removeDelegation(data.id, delegation).then(() => onUpdate)}
                    >
                      <Icon name="trash" />
                    </Button>
                  </div>
                );
              })}
              <p className="text-small cursor-pointer flex">
                <Link onClick={openHandler}>
                  <Icon name="plus" size="1.5rem" className="mr-4" />
                  Delegera checklista
                </Link>
              </p>
            </div>

            <DelegateMultipleChecklistsModal checklistIds={[data.id]} onClose={closeHandler} isOpen={isOpen} />
          </>
        : null}
      </div>
    )
  );
};
