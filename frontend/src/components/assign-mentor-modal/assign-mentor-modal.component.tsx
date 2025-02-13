import { SearchEmployeeComponent, UserInformation } from '@components/search-employee/search-employee.component';
import { assignMentor, removeMentor } from '@services/checklist-service/checklist-service';
import { useChecklist } from '@services/checklist-service/use-checklist';
import { useManagedChecklists } from '@services/checklist-service/use-managed-checklists';
import { Avatar } from '@sk-web-gui/avatar';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Button, Modal, useConfirm } from '@sk-web-gui/react';
import React, { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { getInitials, useUserStore } from '@services/user-service/user-service';
import { useShallow } from 'zustand/react/shallow';
import { useTranslation } from 'react-i18next';
import { FormLabel } from '@sk-web-gui/forms';
import { useRouter } from 'next/router';

export const AssignMentorModal: React.FC = () => {
  const {
    username,
    permissions: { isManager },
  } = useUserStore(useShallow((state) => state.user));
  const methods = useForm();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isUserIntroduction, setIsUserIntroduction] = useState<boolean>();
  const { data, refresh } = useChecklist();
  const { refresh: refreshManagedChecklists } = useManagedChecklists();
  const { t } = useTranslation();
  const router = useRouter();
  const { query } = router;
  const confirm = useConfirm();

  useEffect(() => {
    if (username === query?.userId) {
      setIsUserIntroduction(true);
    }
  }, []);

  const openHandler = () => {
    setIsOpen(true);
  };

  const fields = methods.watch('recipients');

  const closeHandler = () => {
    refresh();
    refreshManagedChecklists();
    methods.setValue('recipients', '');

    setIsOpen(false);
  };

  const onSubmit = () => {
    fields.map((field: UserInformation) => {
      data &&
        assignMentor(data.id, { userId: field.userId, name: field.fullName }).then(() => {
          closeHandler();
        });
    });
  };

  const handleRemoveAssignedMentor = useCallback(
    () => () => {
      confirm
        .showConfirmation(
          t('mentor:confirmation.title', { user: data?.mentor.name }),
          t('mentor:confirmation.text', { user: data?.mentor.name }),
          t('common:remove'),
          t('common:cancel'),
          'error'
        )
        .then((confirmed) => {
          if (confirmed && data) {
            removeMentor(data.id).then(() => {
              closeHandler();
            });
          }
        });
    },
    [data, confirm]
  );

  return (
    <FormProvider {...methods}>
      <FormLabel>{t('mentor:mentor')}</FormLabel>

      <div data-cy="mentor-content">
        {data?.mentor ?
          <div className="flex justify-between mt-8">
            <div className="flex">
              <Avatar initials={getInitials(data?.mentor?.name)} size="sm" rounded className="mr-8" />
              <p>{`${data?.mentor?.name}`}</p>
            </div>
            {isManager && !isUserIntroduction && (
              <Button
                data-cy="remove-assigned-mentor-button"
                iconButton
                size="sm"
                variant="tertiary"
                showBackground={false}
                onClick={handleRemoveAssignedMentor()}
              >
                <Icon name="trash" />
              </Button>
            )}
          </div>
        : isManager && !isUserIntroduction ?
          <Button data-cy="add-mentor-button" variant="tertiary" onClick={openHandler} size="sm" className="mt-8">
            {t('mentor:add')}
          </Button>
        : <p>{t('mentor:not_added')}</p>}

        <Modal
          show={isOpen}
          onClose={closeHandler}
          className="w-[60rem] p-32"
          label={
            <h4 className="text-label-medium">
              {t('checklists:mentor.assign_mentor', { user: `${data?.employee.firstName} ${data?.employee.lastName}` })}
            </h4>
          }
        >
          <Modal.Content>
            <p>{t('mentor:add_description', { user: `${data?.employee.firstName} ${data?.employee.lastName}` })}</p>

            <SearchEmployeeComponent multiple={false} />
          </Modal.Content>

          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                closeHandler();
              }}
            >
              {t('common:cancel')}
            </Button>
            <Button
              data-cy="assign-mentor-button"
              variant="primary"
              disabled={!fields?.length}
              onClick={() => {
                onSubmit();
              }}
            >
              {t('common:add')}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </FormProvider>
  );
};
