import { AssignMentorModal } from '@components/assign-mentor-modal/assign-mentor-modal.component';
import { DelegateMultipleChecklistsModal } from '@components/delegate-checklists-modal/delegate-checklists-modal.component';
import { removeDelegation } from '@services/checklist-service/checklist-service';
import { useChecklist } from '@services/checklist-service/use-checklist';
import { useManagedChecklists } from '@services/checklist-service/use-managed-checklists';
import { getInitials, useUserStore } from '@services/user-service/user-service';
import { Avatar } from '@sk-web-gui/avatar';
import Divider from '@sk-web-gui/divider';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Button, Modal, Tooltip } from '@sk-web-gui/react';
import React, { useState } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDelegatedUsers } from '@services/user-service/use-delegated-user';
import { useRouter } from 'next/router';

interface ChecklistSidebarProps {
  isUserChecklist: boolean;
  isDelegatedChecklist: boolean;
}

export const ChecklistSidebar: React.FC<ChecklistSidebarProps> = ({ isUserChecklist, isDelegatedChecklist }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const {
    permissions: { isManager },
  } = useUserStore(useShallow((state) => state.user));

  const router = useRouter();
  const { pathname } = router;

  const { refresh, data } = useChecklist();
  const { refresh: refreshManagedChecklists } = useManagedChecklists();
  const { data: delegatedUsers } = useDelegatedUsers(data?.delegatedTo ?? []);

  const methods = useForm();
  const { t } = useTranslation();
  const [removeDelegationModalOpen, setRemoveDelegationModalOpen] = useState<boolean>(false);
  const [selectedDelegation, setSelectedDelegation] = useState<string[]>([]);

  const closeRemoveDelegationModalHandler = () => {
    setRemoveDelegationModalOpen(false);
  };

  const initialHover = [false];
  const [hover, setHover] = useState<boolean[]>(initialHover);
  const handleHover = (index: number) => {
    const newHover = [...initialHover];
    newHover[index] = true;
    setHover(newHover);
  };

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

  const handleRemoveDelegation = () => {
    if (data && selectedDelegation) {
      removeDelegation(data.id, selectedDelegation[0]).then(() => {
        onUpdate();
        closeRemoveDelegationModalHandler();
      });
    }
  };

  return (
    data && (
      <div
        className="rounded bg-background-content border-1 border-divider py-24 px-24 min-w-[35rem]"
        data-cy="sidebar"
      >
        <div className="flex gap-16">
          <Avatar rounded initials={`${data.employee?.firstName[0]}${data.employee?.lastName[0]}`} />
          <div>
            <strong>{`${data.employee?.firstName} ${data.employee?.lastName} (${data.employee?.username})`}</strong>
            <p className="text-small my-0">{data.employee?.title ? data.employee?.title : ''}</p>
          </div>
        </div>

        <div className="my-16">
          <strong>{t('common:email')}</strong>
          <p className="m-0">{data.employee?.email}</p>
        </div>

        <div className="my-8">
          <strong>{t('common:start_date')}</strong>
          <p className="m-0">
            {new Date(data.startDate).toLocaleDateString('SV', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>

        {(isDelegatedChecklist || pathname.includes('/admin')) && (
          <div className="mt-16">
            <strong>{t('common:manager')}</strong>
            <p className="m-0">
              {data.manager?.firstName} {data.manager?.lastName}
            </p>
          </div>
        )}

        <Divider className="my-32" />

        <div className="mt-16 mb-24">
          <AssignMentorModal isDelegatedChecklist={isDelegatedChecklist} />
        </div>

        <div data-cy="delegated-to-content">
          <div className="my-8">
            <strong>{t('checklists:delegated_employees')}</strong>

            {data?.delegatedTo?.length ?
              data.delegatedTo?.map((email, index) => {
                return (
                  <div data-cy={`delegated-to-${index}`} key={index} className="flex justify-between mb-16 mt-8">
                    {delegatedUsers?.map((delegated, index) => {
                      if (delegated.email === email) {
                        return (
                          <>
                            <div key={`delegated-user-${index}`}>
                              <Avatar size="sm" className="mr-8" initials={getInitials(delegated.name)} rounded />
                              {delegated.name}
                            </div>

                            {isManager && !isUserChecklist && !isDelegatedChecklist && (
                              <div
                                className="relative w-fit h-fit flex items-center"
                                onMouseEnter={() => handleHover(index)}
                                onMouseLeave={() => setHover(initialHover)}
                              >
                                <Button
                                  data-cy={`remove-delegation-icon-${index}`}
                                  iconButton
                                  size="sm"
                                  variant="tertiary"
                                  showBackground={false}
                                  onClick={() => {
                                    setSelectedDelegation([email, delegated.name]);
                                    setRemoveDelegationModalOpen(true);
                                  }}
                                >
                                  <Icon name="trash" />
                                </Button>
                                <Tooltip
                                  position="right"
                                  className={`${hover[index] ? 'absolute ml-[3rem] w-[9rem]' : 'hidden'}`}
                                >
                                  {t('common:remove')}
                                </Tooltip>
                              </div>
                            )}
                          </>
                        );
                      }
                    })}
                  </div>
                );
              })
            : null}

            {!data?.delegatedTo?.length && isUserChecklist && <p className="pb-8">{t('delegation:no_assignments')}</p>}

            {isManager && !isUserChecklist && !isDelegatedChecklist && (
              <div className="mt-8">
                <Button data-cy="delegate-introduction-button" variant="tertiary" onClick={openHandler} size="sm">
                  {t('delegation:assign_introduction')}
                </Button>

                <FormProvider {...methods}>
                  <DelegateMultipleChecklistsModal checklistIds={[data.id]} onClose={closeHandler} isOpen={isOpen} />
                </FormProvider>
              </div>
            )}
          </div>
        </div>

        <Modal
          show={removeDelegationModalOpen}
          onClose={closeRemoveDelegationModalHandler}
          label={t('delegation:confirmation.title', { user: selectedDelegation[1] })}
          className="max-w-[40rem]"
        >
          <Modal.Content>{t('delegation:confirmation.text', { user: selectedDelegation[1] })}</Modal.Content>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeRemoveDelegationModalHandler}>
              {t('common:cancel')}
            </Button>
            <Button color="error" onClick={handleRemoveDelegation}>
              {t('common:remove')}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  );
};
