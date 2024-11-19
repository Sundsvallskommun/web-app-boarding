import React, { useState } from 'react';
import { Button, Modal, SearchField, Spinner } from '@sk-web-gui/react';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { FormLabel } from '@sk-web-gui/forms';
import { Link } from '@sk-web-gui/link';
import { Employee } from '@data-contracts/backend/data-contracts';
import { assignMentor, getChecklistsAsManager, getEmployee } from '@services/checklist-service/checklist-service';
import { useAppContext } from '@contexts/app.context';
import { useUserStore } from '@services/user-service/user-service';
import { shallow } from 'zustand/shallow';
import { useForm } from 'react-hook-form';

export const AssignMentorModal = () => {
  const user = useUserStore((s) => s.user, shallow);
  const { register, setValue } = useForm();
  const { asEmployeeChecklists, setAsManagerChecklists } = useAppContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [query, setQuery] = useState<string>('');
  const [notFound, setNotFound] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<Employee>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mentorUserId, setMentorUserId] = useState<string>('');

  const openHandler = () => {
    setIsOpen(true);
  };
  const closeHandler = () => {
    setMentorUserId('');
    setSearchResult(null);
    setIsOpen(false);
  };

  const onSearchHandler = (query: string) => {
    setNotFound(false);
    setIsLoading(true);
    getEmployee(query)
      .then((res) => {
        setSearchResult(res);
        setMentorUserId(query);
      })
      .catch(() => {
        setNotFound(true);
      });
    setIsLoading(false);
  };

  const onSubmit = () => {
    assignMentor(asEmployeeChecklists.id, { userId: mentorUserId, name: searchResult.fullname }).then(() => {
      getChecklistsAsManager(user.username).then((res) => setAsManagerChecklists(res));
    });

    closeHandler();
  };

  return (
    <div>
      <p className="text-small cursor-pointer">
        <Link onClick={openHandler}>
          <Icon name="plus" size="1.5rem" className="mr-4" />
          Lägg till mentor
        </Link>
      </p>

      <Modal show={isOpen} onClose={closeHandler} className="w-[70rem] p-32" label={<h4>Lägg till mentor</h4>}>
        <Modal.Content>
          <p className="pb-8">Utse en mentor.</p>

          <FormLabel>{searchResult ? '' : 'Sök på användarnamn'}</FormLabel>
          {!isLoading ?
            !searchResult ?
              <>
                <SearchField
                  {...register('mentorUserId')}
                  value={query}
                  onChange={() => setQuery(query)}
                  onSearch={onSearchHandler}
                  placeholder="Sök"
                />

                {notFound && (
                  <p className="my-0 text-error">
                    <Icon name="info" size="1.5rem" /> Sökningen gav ingen träff
                  </p>
                )}
              </>
            : <div className="flex justify-between">
                <div>
                  <strong>{searchResult.fullname}</strong>
                  <p>{searchResult.email}</p>
                </div>
                <div>
                  <Button
                    color="error"
                    leftIcon={<Icon name="trash" />}
                    onClick={() => {
                      setSearchResult(null);
                      setMentorUserId('');
                      setQuery('');
                    }}
                  >
                    Ta bort
                  </Button>
                </div>
              </div>

          : <Spinner />}
        </Modal.Content>

        <Modal.Footer>
          <Button
            disabled={!mentorUserId && !searchResult}
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
