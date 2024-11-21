import { useAppContext } from '@contexts/app.context';
import { AddActivityModal } from '@components/add-activity-modal/add-activity-modal.component';
import { Avatar } from '@sk-web-gui/avatar';
import { AssignMentorModal } from '@components/assign-mentor-modal/assign-mentor-modal.component';
import { DelegateMultipleChecklistsModal } from '@components/delegate-checklists-modal/delegate-checklists-modal.component';
import { useState } from 'react';
import { Link } from '@sk-web-gui/link';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';

export const ChecklistHeader = () => {
  const { asManagerChecklists, asEmployeeChecklists } = useAppContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openHandler = () => {
    setIsOpen(true);
  };
  const closeHandler = () => {
    setIsOpen(false);
  };

  const getNameOfEmployee = () => {
    return `${asManagerChecklists[0].employee.firstName} ${asManagerChecklists[0].employee.lastName} (${asManagerChecklists[0].employee.username})`;
  };

  return (
    <div className="flex justify-between mb-32 mt-8">
      <div className="flex gap-16">
        <Avatar rounded />
        <div>
          <strong>{getNameOfEmployee()}</strong>
          <p className="text-small my-0">Befattning</p>
        </div>
      </div>

      <div>
        <strong>Anställningsdatum</strong>
        <p className="text-small">{asManagerChecklists[0].startDate}</p>
      </div>

      <div>
        <strong>Mentor</strong>
        <AssignMentorModal />
      </div>

      <div>
        <strong>Delegerad till</strong>
        <p className="text-small cursor-pointer flex">
          <Link onClick={openHandler}>
            <Icon name="plus" size="1.5rem" className="mr-4" />
            Delegera checklista
          </Link>
        </p>
      </div>

      <DelegateMultipleChecklistsModal fields={[asEmployeeChecklists]} closeHandler={closeHandler} isOpen={isOpen} />
      <AddActivityModal />
    </div>
  );
};
