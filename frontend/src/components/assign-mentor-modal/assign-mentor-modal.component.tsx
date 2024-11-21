import React, { useState } from 'react';
import { Button, Modal } from '@sk-web-gui/react';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Link } from '@sk-web-gui/link';
import {
  assignMentor,
  getChecklistAsEmployee,
  getChecklistsAsManager,
  removeMentor,
} from '@services/checklist-service/checklist-service';
import { useAppContext } from '@contexts/app.context';
import { useUserStore } from '@services/user-service/user-service';
import { shallow } from 'zustand/shallow';
import { useFieldArray, useForm } from 'react-hook-form';
import { SearchEmployeeComponent } from '@components/search-employee/search-employee.component';
import { Mentor } from '@data-contracts/backend/data-contracts';

export const AssignMentorModal = () => {
  const user = useUserStore((s) => s.user, shallow);
  const { control } = useForm();
  const { asEmployeeChecklists, setAsManagerChecklists, setAsEmployeeChecklists } = useAppContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'recipient',
  });

  const openHandler = () => {
    setIsOpen(true);
  };

  const closeHandler = () => {
    remove();
    setIsOpen(false);
  };

  const onSubmit = () => {
    fields.map((field: Mentor & { id: string }) => {
      assignMentor(asEmployeeChecklists.id, { userId: field.userId, name: field.name }).then(() => {
        getChecklistsAsManager(user.username).then((res) => setAsManagerChecklists(res));
        getChecklistAsEmployee(asEmployeeChecklists.employee.username).then((res) => setAsEmployeeChecklists(res));
      });
    });

    remove();
    closeHandler();
  };

  const removeAssignedMentor = () => {
    removeMentor(asEmployeeChecklists.id).then(() => {
      getChecklistsAsManager(user.username).then((res) => setAsManagerChecklists(res));
      getChecklistAsEmployee(asEmployeeChecklists.employee.username).then((res) => setAsEmployeeChecklists(res));
    });
  };

  return (
    <div>
      {asEmployeeChecklists?.mentor ?
        <div className="flex gap-8">
          <p className="text-small">{`${asEmployeeChecklists.mentor.name} (${asEmployeeChecklists.mentor.userId})`}</p>
          <Button iconButton name="trash" size="sm" inverted onClick={() => removeAssignedMentor()}>
            <Icon name="trash" />
          </Button>
        </div>
      : <p className="text-small cursor-pointer">
          <Link onClick={openHandler}>
            <Icon name="plus" size="1.5rem" className="mr-4" />
            Lägg till mentor
          </Link>
        </p>
      }

      <Modal show={isOpen} onClose={closeHandler} className="w-[70rem] p-32" label={<h4>Lägg till mentor</h4>}>
        <Modal.Content>
          <p className="pb-8">Utse en mentor.</p>

          <SearchEmployeeComponent multiple={false} fields={fields} append={append} remove={remove} />
        </Modal.Content>

        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              closeHandler();
            }}
          >
            Avbryt
          </Button>
          <Button
            variant="primary"
            disabled={!fields.length}
            onClick={() => {
              onSubmit();
            }}
          >
            Lägg till
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
