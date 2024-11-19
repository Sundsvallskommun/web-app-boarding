import { Checkbox, Divider, Label, Link, TextField } from '@sk-web-gui/react';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import {
  getChecklistAsEmployee,
  getChecklistsAsManager,
  updateTaskFulfilmentStatus,
} from '@services/checklist-service/checklist-service';
import { useAppContext } from '@contexts/app.context';
import { useUserStore } from '@services/user-service/user-service';
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

export const ActivityListItem = (props: any) => {
  const user = useUserStore((s) => s.user, shallow);
  const { task, checklistId, employee } = props;
  const { setAsManagerChecklists, setAsEmployeeChecklists } = useAppContext();

  const setRoleTypeLabel = (roleType: string) => {
    switch (roleType) {
      case 'MANAGER':
        return (
          <Label color="bjornstigen" rounded inverted>
            Aktivitet för anställd chef
          </Label>
        );
      default:
        return null;
    }
  };

  const updateTaskFulfilment = (newFulfilmentStatus: string) => {
    updateTaskFulfilmentStatus(checklistId, task.id, newFulfilmentStatus, user.username).then(() => {
      getChecklistsAsManager(user.username).then((res) => setAsManagerChecklists(res));
      getChecklistAsEmployee(employee).then((res) => setAsEmployeeChecklists(res));
    });
  };

  return (
    <div>
      <Divider />
      <div className="my-4 flex p-16">
        <div className="w-10/12 mt-8 flex items-start">
          {task.questionType === 'YES_OR_NO' ?
            <Checkbox
              checked={isChecked(task.fulfilmentStatus)}
              value={task.fulfilmentStatus}
              className="pr-3"
              onChange={() => {
                updateTaskFulfilment(task.fulfilmentStatus === 'TRUE' ? 'FALSE' : 'TRUE');
              }}
            />
          : null}
          <div className={task.questionType === 'YES_OR_NO' ? 'pl-20' : ''}>
            <div className={task.done && 'text-dark-disabled'}>
              {task.linkUrl ?
                <>
                  <span className="font-bold underline cursor-pointer">{task.linkTitle}</span>{' '}
                  <Link href="#">
                    <Icon name="external-link" size="1em" className="align-text-top" />
                  </Link>
                </>
              : <span className="mr-3 font-bold">{task.heading}</span>}
              <p>{task.text}</p>
              {task.type === 'textfield' && <TextField size="sm" className="w-full" />}
            </div>
          </div>
        </div>
        <div className="w-3/12 text-right mt-8 mr-8">{setRoleTypeLabel(task.roleType)}</div>
      </div>
    </div>
  );
};
