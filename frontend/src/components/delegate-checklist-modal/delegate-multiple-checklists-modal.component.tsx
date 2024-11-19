import React, { useState } from 'react';
import { Button, Modal, SearchField, Spinner } from '@sk-web-gui/react';
import { FormLabel } from '@sk-web-gui/forms';
import { getEmployee } from '@services/checklist-service/checklist-service';
import { Employee } from '@data-contracts/backend/data-contracts';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';

export const DelegateMultipleChecklistsModal = ({ fields, openHandler, closeHandler, isOpen }) => {
  const [query, setQuery] = useState<string>('');
  const [notFound, setNotFound] = useState<boolean>(false);
  const [searchResult, setSearchResult] = useState<Employee>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSearchHandler = (query: string) => {
    setNotFound(false);
    setIsLoading(true);
    getEmployee(query)
      .then((res) => {
        setSearchResult(res);
      })
      .catch(() => {
        setNotFound(true);
      });
    setIsLoading(false);
  };

  const onSubmit = () => {
    console.log('Delegera', searchResult);
  };

  return (
    <div>
      <Button color="vattjom" onClick={openHandler}>
        Delegera checklista
      </Button>

      <Modal show={isOpen} onClose={closeHandler} className="w-[70rem] p-32" label={<h4>Delegera checklista</h4>}>
        <Modal.Content>
          <p className="pb-8">Delegera checklistan till personer som hjälper till i introduktionen.</p>

          <FormLabel>Sök på användarnamn</FormLabel>
          {!isLoading ?
            !searchResult ?
              <>
                <SearchField
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
            disabled={!searchResult}
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
