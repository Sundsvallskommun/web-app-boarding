import { useAppContext } from '@contexts/app.context';
import { AddActivityModal } from '@components/add-activity-modal/add-activity-modal.component';
import { Avatar } from '@sk-web-gui/avatar';
import { DelegateChecklistModal } from '@components/delegate-checklist-modal/delegate-checklist-modal.component';
import { AssignMentorModal } from '@components/assign-mentor-modal/assign-mentor-modal.component';

export const ChecklistHeader = () => {
  const { asManagerChecklists } = useAppContext();

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
        <DelegateChecklistModal />
      </div>

      <AddActivityModal />
    </div>
  );
};
