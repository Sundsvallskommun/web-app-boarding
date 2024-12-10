import { SearchEmployeeComponent } from '@components/search-employee/search-employee.component';
import { delegateChecklist } from '@services/checklist-service/checklist-service';
import { FormLabel } from '@sk-web-gui/forms';
import { Button, Modal, useSnackbar } from '@sk-web-gui/react';
import { useTranslation } from 'next-i18next';
import React from 'react';
import { FormProvider, useFieldArray, useFormContext } from 'react-hook-form';

interface DelegateMultipleChecklistsModalProps {
  checklistIds: string[];
  onClose: () => void;
  isOpen: boolean;
}

interface UserForm {
  userId: string;
  fieldId: string;
  name: string;
  email: string;
}

export const DelegateMultipleChecklistsModal: React.FC<DelegateMultipleChecklistsModalProps> = ({
  checklistIds,
  onClose,
  isOpen,
}) => {
  const methods = useFormContext<{ recipients: UserForm[] }>();

  const toastMessage = useSnackbar();
  const { t } = useTranslation();

  const { remove } = useFieldArray({
    control: methods.control,
    keyName: 'fieldId',
    name: 'recipients',
  });

  const recipients = methods.watch('recipients');

  const closeHandler = () => {
    remove();
    onClose();
  };

  const onSubmit = () => {
    checklistIds.map((checklistId: string) => {
      recipients.map((recipient: { email: string; fieldId: string; name: string; userId: string }) => {
        delegateChecklist(checklistId, recipient.email)
          .then(() => {
            closeHandler();
          })
          .catch(() => {
            toastMessage({
              position: 'bottom',
              closeable: false,
              message: t('delegation:errors.conflict', { user: recipient.email }),
              status: 'error',
            });
          });
      });
    });
  };

  return (
    <FormProvider {...methods}>
      <Modal
        show={isOpen}
        onClose={() => closeHandler()}
        className="w-[70rem] p-32"
        label={<h4 className="text-label-medium">Tilldela introduktion</h4>}
      >
        <Modal.Content>
          <p>Tilldela personer som ansvarar för delar av introduktionen.</p>

          <FormLabel>Sök på användarnamn</FormLabel>
          <SearchEmployeeComponent multiple={true} />
        </Modal.Content>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => closeHandler()}>
            {t('common:cancel')}
          </Button>

          <Button disabled={!recipients?.length || !checklistIds?.length} onClick={() => onSubmit()}>
            Tilldela
          </Button>
        </Modal.Footer>
      </Modal>
    </FormProvider>
  );
};
