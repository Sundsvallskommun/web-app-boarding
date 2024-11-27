import { useAppContext } from '@contexts/app.context';
import { Avatar } from '@sk-web-gui/avatar';
import { AssignMentorModal } from '@components/assign-mentor-modal/assign-mentor-modal.component';
import { DelegateMultipleChecklistsModal } from '@components/delegate-checklists-modal/delegate-checklists-modal.component';
import React, { useState } from 'react';
import { Link } from '@sk-web-gui/link';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import Divider from '@sk-web-gui/divider';
import { Button } from '@sk-web-gui/react';
import { getChecklistAsEmployee, removeDelegation } from '@services/checklist-service/checklist-service';

export const ChecklistSidebar = () => {
  const { asManagerChecklists, asEmployeeChecklists, setAsEmployeeChecklists } = useAppContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openHandler = () => {
    setIsOpen(true);
  };
  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    asEmployeeChecklists && (
      <div className="rounded bg-white border-1 border-divider py-8 px-24">
        <div className="my-8">
          <strong>{`${asEmployeeChecklists.employee.firstName} ${asEmployeeChecklists.employee.lastName} (${asEmployeeChecklists.employee.username})`}</strong>
          <p className="text-small my-0">
            {asEmployeeChecklists.employee.title ? asEmployeeChecklists.employee.title : ''}
          </p>
        </div>

        <div className="my-8">
          <strong>Anställningsdatum</strong>
          <p className="text-small">{asEmployeeChecklists.startDate}</p>
        </div>

        {asManagerChecklists.length ?
          <>
            <Divider className="my-24" />

            <div className="my-16">
              <strong>Mentor</strong>
              <AssignMentorModal />
            </div>

            <div className="my-16">
              <strong>Delegerad till</strong>
              {asEmployeeChecklists.delegatedTo?.map((delegation, index) => {
                return (
                  <div key={index} className="mt-8">
                    <Avatar size="sm" className="mr-4" rounded /> {delegation}
                    <Button
                      iconButton
                      name="trash"
                      size="sm"
                      inverted
                      onClick={() =>
                        removeDelegation(asEmployeeChecklists.id, delegation).then(() =>
                          getChecklistAsEmployee(asEmployeeChecklists.employee.username).then((res) =>
                            setAsEmployeeChecklists(res)
                          )
                        )
                      }
                    >
                      <Icon name="trash" />
                    </Button>
                  </div>
                );
              })}
              <p className="text-small cursor-pointer flex">
                <Link onClick={openHandler}>
                  <Icon name="plus" size="1.5rem" className="mr-4" />
                  Delegera checklista
                </Link>
              </p>
            </div>

            <DelegateMultipleChecklistsModal
              checklistIds={[asEmployeeChecklists.id]}
              closeHandler={closeHandler}
              isOpen={isOpen}
            />
          </>
        : null}
      </div>
    )
  );
};
