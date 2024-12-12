import { AssignMentorModal } from '@components/assign-mentor-modal/assign-mentor-modal.component';
import { DelegateMultipleChecklistsModal } from '@components/delegate-checklists-modal/delegate-checklists-modal.component';
import { removeDelegation } from '@services/checklist-service/checklist-service';
import { useChecklist } from '@services/checklist-service/use-checklist';
import { useManagedChecklists } from '@services/checklist-service/use-managed-checklists';
import { useUserStore } from '@services/user-service/user-service';
import { Avatar } from '@sk-web-gui/avatar';
import Divider from '@sk-web-gui/divider';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Button } from '@sk-web-gui/react';
import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

export const ChecklistSidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    username,
    permissions: { isManager },
  } = useUserStore(useShallow((state) => state.user));

  const { refresh, data } = useChecklist();
  const { refresh: refreshManagedChecklists } = useManagedChecklists();

  const methods = useForm();
  const { t } = useTranslation();

  const openHandler = () => {
    setIsOpen(true);
  };

  const onUpdate = () => {
    refresh();
    refreshManagedChecklists();
  };

  const closeHandler = () => {
    onUpdate();
    setIsOpen(false);
  };

  return (
    data && (
      <div className="rounded bg-white border-1 border-divider py-24 px-24">
        <div className="flex gap-16">
          <Avatar rounded initials={`${data.employee.firstName[0]}${data.employee.lastName[0]}`} />
          <div>
            <strong>{`${data.employee?.firstName} ${data.employee?.lastName} (${data.employee?.username})`}</strong>
            <p className="text-small my-0">{data.employee?.title ? data.employee?.title : ''}</p>
          </div>
        </div>

        <div className="my-16">
          <strong>{t('common:email')}</strong>
          <p className="m-0">{data.employee.email}</p>
        </div>

        <div className="my-8">
          <strong>{t('common:start_date')}</strong>
          <p className="m-0">{data.startDate}</p>
        </div>

        <Divider className="my-24" />

        <div className="mt-16 mb-24">
          <AssignMentorModal />
        </div>

        {isManager ?
          <>
            {data?.employee.username !== username && (
              <div>
                <div className="my-8">
                  <strong>{t('checklists:delegated_employees')}</strong>

                  {data.delegatedTo?.map((email, index) => {
                    return (
                      <div key={index} className="flex justify-between mb-16 mt-8">
                        <div>
                          <Avatar size="sm" className="mr-4" rounded /> {email}
                        </div>

                        <Button
                          iconButton
                          size="sm"
                          variant="tertiary"
                          showBackground={false}
                          onClick={() => removeDelegation(data.id, email).then(() => onUpdate())}
                        >
                          <Icon name="trash" />
                        </Button>
                      </div>
                    );
                  })}
                </div>

                <Button variant="tertiary" onClick={openHandler} size="sm">
                  {t('delegation:assign_introduction')}
                </Button>

                <FormProvider {...methods}>
                  <DelegateMultipleChecklistsModal checklistIds={[data.id]} onClose={closeHandler} isOpen={isOpen} />
                </FormProvider>
              </div>
            )}
          </>
        : null}
      </div>
    )
  );
};
