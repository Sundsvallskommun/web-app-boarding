import { SearchEmployeeComponent } from '@components/search-employee/search-employee.component';
import { delegateChecklist } from '@services/checklist-service/checklist-service';
import { FormLabel } from '@sk-web-gui/forms';
import { Button, Modal, useSnackbar } from '@sk-web-gui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';

interface DelegateMultipleChecklistsModalProps {
  checklistIds: string[];
  onClose: () => void;
  isOpen: boolean;
}

export const DelegateMultipleChecklistsModal: React.FC<DelegateMultipleChecklistsModalProps> = ({
  checklistIds,
  onClose,
  isOpen,
}) => {
  const { control } = useForm();

  const toastMessage = useSnackbar();
  const { t } = useTranslation();

  const { fields, append, remove } = useFieldArray({
    control,
    keyName: 'fieldId',
    name: 'recipients',
  });

  const closeHandler = () => {
    remove();
    onClose();
  };

  const onSubmit = () => {
    checklistIds.map((checklistId: string) => {
      fields.map((field: { email: string; fieldId: string; name: string; userId: string }) => {
        delegateChecklist(checklistId, field.email)
          .then(() => {
            closeHandler();
          })
          .catch(() => {
            toastMessage({
              position: 'bottom',
              closeable: false,
              message: t('delegation:errors.conflict', { user: field.email }),
              status: 'error',
            });
          });
      });
    });
  };

  return (
    <div>
      <Modal show={isOpen} onClose={onClose} className="w-[70rem] p-32" label={<h4>Delegera checklista</h4>}>
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
