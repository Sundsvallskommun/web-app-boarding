import { useState } from 'react';
import { Button, Modal, SearchField } from '@sk-web-gui/react';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { FormLabel } from '@sk-web-gui/forms';
import { Link } from '@sk-web-gui/link';

export const DelegateChecklistModal = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openHandler = () => {
    setIsOpen(true);
  };
  const closeHandler = () => {
    setIsOpen(false);
  };

  const onSubmit = () => {
    closeHandler();
  };

  return (
    <div>
      <p className="text-small cursor-pointer flex">
        <Link onClick={openHandler}>
          <Icon name="plus" size="1.5rem" className="mr-4" />
          Delegera checklista
        </Link>
      </p>

      <Modal show={isOpen} onClose={closeHandler} className="w-[70rem] p-32" label={<h4>Delegera checklista</h4>}>
        <Modal.Content>
          <p> Här ska det rimligen stå någon bra text </p>

          <FormLabel>Sök mottagare</FormLabel>
          <SearchField value={''} onChange={() => console.log()} placeholder="Sök" />
        </Modal.Content>

        <Modal.Footer>
          <Button
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
