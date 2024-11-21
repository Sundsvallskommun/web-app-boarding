import React from 'react';
import { Button, Modal } from '@sk-web-gui/react';
import { FormLabel } from '@sk-web-gui/forms';
import { SearchEmployeeComponent } from '@components/search-employee/search-employee.component';
import { useFieldArray, useForm } from 'react-hook-form';
import { delegateChecklist, getChecklistsAsManager } from '@services/checklist-service/checklist-service';
import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';
import { useAppContext } from '@contexts/app.context';
import { useUserStore } from '@services/user-service/user-service';
import { shallow } from 'zustand/shallow';

export const DelegateMultipleChecklistsModal = ({ fields: checklists, closeHandler, isOpen }) => {
  const user = useUserStore((s) => s.user, shallow);
  const { control } = useForm();
  const { setAsManagerChecklists } = useAppContext();

  const { fields, append, remove } = useFieldArray({
    control,
    keyName: 'fieldId',
    name: 'recipients',
  });

  const onSubmit = () => {
    checklists.map((checklist: EmployeeChecklist) => {
      fields.map((field: { email: string; fieldId: string; name: string; userId: string }) => {
        delegateChecklist(checklist.id, field.email);
      });
    });

    getChecklistsAsManager(user.username).then((res) => setAsManagerChecklists(res));
    remove();
  };

  return (
    <div>
      <Modal show={isOpen} onClose={closeHandler} className="w-[70rem] p-32" label={<h4>Delegera checklista</h4>}>
        <Modal.Content>
          <p className="pb-8">Delegera checklistan till personer som hjälper till i introduktionen.</p>

          <FormLabel>Sök på användarnamn</FormLabel>
          <SearchEmployeeComponent multiple={true} fields={fields} append={append} remove={remove} />
        </Modal.Content>

        <Modal.Footer>
          <Button
            disabled={!fields.length || !checklists.length}
            onClick={() => {
              onSubmit();
            }}
          >
            Delegera
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
