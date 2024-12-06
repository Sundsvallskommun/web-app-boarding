import { SearchEmployeeComponent } from '@components/search-employee/search-employee.component';
import { Mentor } from '@data-contracts/backend/data-contracts';
import { assignMentor, removeMentor } from '@services/checklist-service/checklist-service';
import { useChecklist } from '@services/checklist-service/use-checklist';
import { useManagedChecklists } from '@services/checklist-service/use-managed-checklists';
import { Avatar } from '@sk-web-gui/avatar';
import { Link } from '@sk-web-gui/link';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Button, Modal } from '@sk-web-gui/react';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

export const AssignMentorModal: React.FC = () => {
  const methods = useForm();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { data, refresh } = useChecklist();
  const { refresh: refreshManagedChecklists } = useManagedChecklists();

  const openHandler = () => {
    setIsOpen(true);
  };

  const fields = methods.watch('recipients');

  const closeHandler = () => {
    refresh();
    refreshManagedChecklists();

    setIsOpen(false);
  };

  const onSubmit = () => {
    fields.map((field: Mentor & { id: string }) => {
      data &&
        assignMentor(data.id, { userId: field.userId, name: field.name }).then(() => {
          closeHandler();
        });
    });
  };

  const removeAssignedMentor = () => {
    data &&
      removeMentor(data.id).then(() => {
        closeHandler();
      });
  };

  return (
    <FormProvider {...methods}>
      <div>
        {data?.mentor ?
          <div className="flex gap-8">
            <Avatar size="sm" rounded />
            <p>{`${data?.mentor?.name} (${data?.mentor?.userId})`}</p>
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

            <SearchEmployeeComponent multiple={false} />
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
              disabled={!fields?.length}
              onClick={() => {
                onSubmit();
              }}
            >
              Lägg till
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </FormProvider>
  );
};
