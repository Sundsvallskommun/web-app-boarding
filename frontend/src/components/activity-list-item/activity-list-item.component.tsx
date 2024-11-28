import { Checkbox, Label } from '@sk-web-gui/react';
import {
  getChecklistAsEmployee,
  getChecklistsAsManager,
  updateTaskFulfilmentStatus,
} from '@services/checklist-service/checklist-service';
import { useAppContext } from '@contexts/app.context';
import { useUserStore } from '@services/user-service/user-service';
import { shallow } from 'zustand/shallow';
import sanitized from '@services/sanitizer-service';

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

export const ActivityListItem = (props: any) => {
  const user = useUserStore((s) => s.user, shallow);
  const { task, checklistId, employee, currentView } = props;
  const { setAsManagerChecklists, setAsEmployeeChecklists } = useAppContext();

  const updateTaskFulfilment = (newFulfilmentStatus: string) => {
    updateTaskFulfilmentStatus(checklistId, task.id, newFulfilmentStatus, user.username).then(() => {
      if (currentView === 0) {
        getChecklistsAsManager(user.username).then((res) => setAsManagerChecklists(res));
      } else {
        getChecklistAsEmployee(employee).then((res) => {
          setAsEmployeeChecklists(res);
        });
      }
    });
  };

  return (
    <div>
      <div className="my-4 flex p-16">
        <div className="w-10/12 mt-8 flex items-start">
          <Checkbox
            checked={isChecked(task.fulfilmentStatus)}
            value={task.fulfilmentStatus}
            className="pr-3"
            onChange={() => {
              updateTaskFulfilment(task.fulfilmentStatus === 'TRUE' ? 'FALSE' : 'TRUE');
            }}
          />
          <div className="pl-20">
            <div className={task.fulfilmentStatus === 'TRUE' ? 'text-dark-disabled' : ''}>
              <span className="mr-3 text-large">{task.heading}</span>
              <p>
                <span
                  className="my-0 [&>ul]:list-disc [&>ol]:list-decimal [&>ul]:ml-lg [&>ol]:ml-lg"
                  dangerouslySetInnerHTML={{
                    __html: sanitized(task.text),
                  }}
                ></span>
              </p>
              {task.customTask && (
                <Label className="mt-4" rounded inverted>
                  Egen aktivitet
                </Label>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
