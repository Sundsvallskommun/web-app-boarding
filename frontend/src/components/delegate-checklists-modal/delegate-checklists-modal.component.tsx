import React from 'react';
import { Button, Modal, useSnackbar } from '@sk-web-gui/react';
import { FormLabel } from '@sk-web-gui/forms';
import { SearchEmployeeComponent } from '@components/search-employee/search-employee.component';
import { useFieldArray, useForm } from 'react-hook-form';
import { delegateChecklist, getChecklistAsEmployee } from '@services/checklist-service/checklist-service';
import { useAppContext } from '@contexts/app.context';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';

export const DelegateMultipleChecklistsModal = ({ checklistIds, closeHandler, isOpen }) => {
  const { control } = useForm();
  const { setAsEmployeeChecklists } = useAppContext();
  const router = useRouter();
  const { query } = router;
  const toastMessage = useSnackbar();
  const { t } = useTranslation();

  const { fields, append, remove } = useFieldArray({
    control,
    keyName: 'fieldId',
    name: 'recipients',
  });

  const onSubmit = () => {
    checklistIds.map((checklistId: string) => {
      fields.map((field: { email: string; fieldId: string; name: string; userId: string }) => {
        delegateChecklist(checklistId, field.email)
          .then(() => {
            if (query.userId) {
              getChecklistAsEmployee(query.userId.toString()).then((res) => setAsEmployeeChecklists(res));
            }
          })
          .catch(() => {
            toastMessage({
              position: 'bottom',
              closeable: false,
              message: t('delegation:errors.conflict') + `${field.email}`,
              status: 'error',
            });
          });
      });
    });

    remove();
    closeHandler();
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
            disabled={!fields.length || !checklistIds.length}
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
