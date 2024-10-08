import { useState } from 'react';
import { Button, Icon, Modal, RadioButton, Select, Textarea } from '@sk-web-gui/react';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@sk-web-gui/forms';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

let formSchema = yup.object({
  type: yup.string(),
  phase: yup.string().required('Du måste välja en fas'),
  heading: yup.string().required('Du måste skriva en rubrik'),
  link: yup.string(),
  content: yup.string(),
});

export const AddActivityModal = () => {
  const formControl = useForm({
    defaultValues: {
      type: '0',
      phase: '',
      heading: '',
      link: '',
      content: '',
    },
    resolver: yupResolver(formSchema),
  });

  const {
    register,
    getValues,
    trigger,
    formState: { errors, isDirty },
  } = formControl;

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openHandler = () => {
    setIsOpen(true);
  };
  const closeHandler = () => {
    setIsOpen(false);
  };

  const onSubmit = () => {
    console.log(getValues());
    closeHandler();
  };

  return (
    <div>
      <Button variant="secondary" onClick={openHandler}>
        <Icon name="plus" size="18px" /> Lägg till aktivitet
      </Button>

      <Modal show={isOpen} onClose={closeHandler} className="w-[70rem] p-32" label={<h4>Lägg till aktivitet</h4>}>
        <Modal.Content>
          <FormControl className="w-full">
            <FormLabel>Aktivitetstyp (obligatorisk)</FormLabel>
            <RadioButton.Group inline={true} className="mb-16">
              <RadioButton {...register('type')} value="0">
                För dig
              </RadioButton>
              <RadioButton {...register('type')} value="1">
                För medarbetaren
              </RadioButton>
            </RadioButton.Group>

            <FormLabel>Fas (obligatorisk)</FormLabel>
            <Select {...register('phase')} className="mb-16">
              <Select.Option disabled>Välj fas</Select.Option>
              <Select.Option>Inför första dagen</Select.Option>
              <Select.Option>Första dagen</Select.Option>
              <Select.Option>Första veckan</Select.Option>
              <Select.Option>Uppföljning</Select.Option>
            </Select>
            {errors.phase && <FormErrorMessage className="text-error">{errors.phase?.message}</FormErrorMessage>}

            <FormLabel>Rubrik (obligatorisk)</FormLabel>
            <Input {...register('heading', { required: true })} className="mb-16" />
            {errors.heading && <FormErrorMessage className="text-error">{errors.heading?.message}</FormErrorMessage>}

            <FormLabel>Länk</FormLabel>
            <Input {...register('link')} className="mb-16" />

            <FormLabel>Brödtext</FormLabel>
            <Textarea {...register('content')} className="w-full" />
          </FormControl>
        </Modal.Content>

        <Modal.Footer className="justify-end">
          <Button variant="secondary" onClick={closeHandler}>
            Avbryt
          </Button>
          <Button
            onClick={() => {
              trigger();
            }}
          >
            Lägg till
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
