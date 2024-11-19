import { useState } from 'react';
import { Button, Modal, RadioButton, Select, Textarea } from '@sk-web-gui/react';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@sk-web-gui/forms';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppContext } from '@contexts/app.context';
import {
  addCustomTask,
  getChecklistAsEmployee,
  getChecklistsAsManager,
} from '@services/checklist-service/checklist-service';
import { useUserStore } from '@services/user-service/user-service';
import { shallow } from 'zustand/shallow';

let formSchema = yup.object({
  heading: yup.string().min(1, 'Du måste skriva en rubrik').required('Du måste skriva en rubrik'),
  text: yup.string(),
  questionType: yup.string(),
  phaseId: yup.string().required('Du måste välja en fas'),
  checklistOwner: yup.string(),
  sortOrder: yup.number().required(),
  createdBy: yup.string().required(),
});

export const AddActivityModal = () => {
  const user = useUserStore((s) => s.user, shallow);
  const { asManagerChecklists, setAsManagerChecklists, asEmployeeChecklists, setAsEmployeeChecklists } =
    useAppContext();

  const formControl = useForm({
    defaultValues: {
      heading: '',
      text: '',
      questionType: 'YES_OR_NO',
      checklistOwner: 'MANAGER',
      phaseId: '',
      createdBy: '',
      sortOrder: 0,
    },
    resolver: yupResolver(formSchema),
  });

  const {
    register,
    getValues,
    trigger,
    watch,
    reset,
    formState: { errors },
  } = formControl;

  const { checklistOwner, heading, phaseId } = watch();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openHandler = () => {
    setIsOpen(true);
  };
  const closeHandler = () => {
    reset();
    setIsOpen(false);
  };

  const onSubmit = () => {
    addCustomTask(asManagerChecklists[0].id, getValues('phaseId'), user.username, getValues()).then(() => {
      getChecklistAsEmployee(asManagerChecklists[0].employee.username).then((res) => setAsEmployeeChecklists(res));
      getChecklistsAsManager(user.username).then((res) => setAsManagerChecklists(res));
    });
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
              <RadioButton {...register('checklistOwner')} value="MANAGER">
                För dig
              </RadioButton>
              <RadioButton {...register('checklistOwner')} value="EMPLOYEE">
                För medarbetaren
              </RadioButton>
            </RadioButton.Group>

            <FormLabel>Fas (obligatorisk)</FormLabel>
            <Select {...register('phaseId')} onBlur={() => trigger('phaseId')}>
              <Select.Option value="" disabled>
                Välj fas
              </Select.Option>
              {checklistOwner === 'MANAGER' ?
                asManagerChecklists[0].phases.map((p) => {
                  return (
                    <Select.Option key={p.id} value={p.id}>
                      {p.name}
                    </Select.Option>
                  );
                })
              : asEmployeeChecklists.phases.map((p) => {
                  return (
                    <Select.Option key={p.id} value={p.id}>
                      {p.name}
                    </Select.Option>
                  );
                })
              }
            </Select>
            {errors.phaseId && (
              <FormErrorMessage className="text-error">
                <Icon size="1.5rem" name="info" /> {errors.phaseId?.message}
              </FormErrorMessage>
            )}

            <FormLabel className="mt-16">Rubrik (obligatorisk)</FormLabel>
            <Input {...register('heading', { required: true })} onBlur={() => trigger('heading')} />
            {errors.heading && (
              <FormErrorMessage className="text-error">
                <Icon size="1.5rem" name="info" /> {errors.heading?.message}
              </FormErrorMessage>
            )}

            {/* TODO missing in API?
            <FormLabel>Länk</FormLabel>
            <Input {...register('link')} className="mb-16" />*/}

            <FormLabel className="mt-16">Brödtext</FormLabel>
            <Textarea {...register('text')} className="w-full" />
          </FormControl>
        </Modal.Content>

        <Modal.Footer className="justify-end">
          <Button variant="secondary" onClick={closeHandler}>
            Avbryt
          </Button>
          <Button
            disabled={!phaseId || !heading}
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
