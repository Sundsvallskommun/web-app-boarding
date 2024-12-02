import { useEffect, useRef, useState } from 'react';
import { Button, Modal } from '@sk-web-gui/react';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@sk-web-gui/forms';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAppContext } from '@contexts/app.context';
import {
  getChecklistAsEmployee,
  getChecklistsAsManager,
  updateCustomTask,
} from '@services/checklist-service/checklist-service';
import { useUserStore } from '@services/user-service/user-service';
import { shallow } from 'zustand/shallow';
import { RichTextEditor } from '@components/rich-text-editor/rich-text-editor.component';
import sanitized from '@services/sanitizer-service';

let formSchema = yup.object({
  heading: yup.string().min(1, 'Du måste skriva en rubrik').required('Du måste skriva en rubrik'),
  text: yup.string(),
  questionType: yup.string().required(),
  sortOrder: yup.number().required(),
  updatedBy: yup.string().required(),
});

export const EditTaskModal = ({ closeHandler, isOpen, task, checklistId }) => {
  const user = useUserStore((s) => s.user, shallow);
  const { setAsManagerChecklists, asEmployeeChecklists, setAsEmployeeChecklists } = useAppContext();
  const [richText, setRichText] = useState<string>('');
  const quillRef = useRef(null);

  const formControl = useForm({
    defaultValues: {
      heading: task.heading,
      text: task.text,
      questionType: task.questionType,
      updatedBy: user.username,
      sortOrder: 0,
    },
    resolver: yupResolver(formSchema),
  });

  const {
    register,
    setValue,
    getValues,
    trigger,
    watch,
    formState: { errors },
  } = formControl;

  const { heading } = watch();

  const onSubmit = () => {
    updateCustomTask(checklistId, task.id, getValues()).then(() => {
      getChecklistsAsManager(user.username).then((res) => setAsManagerChecklists(res));
      getChecklistAsEmployee(asEmployeeChecklists.employee.username).then((res) => setAsEmployeeChecklists(res));
    });

    closeHandler();
  };

  useEffect(() => {
    setRichText(getValues('text'));
  }, []);

  const onRichTextChange = (val: string) => {
    const editor = quillRef.current?.getEditor();
    const length = editor?.getLength();
    setValue('text', sanitized(length > 1 ? val : undefined));
    setRichText(val);
  };

  return (
    <Modal show={isOpen} onClose={closeHandler} className="w-[70rem] p-32" label={<h4>Redigera aktivitet</h4>}>
      <Modal.Content>
        <FormControl className="w-full">
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
          <RichTextEditor
            ref={quillRef}
            containerLabel="text"
            value={richText}
            onChange={(value) => {
              return onRichTextChange(value);
            }}
          />
        </FormControl>
      </Modal.Content>

      <Modal.Footer className="justify-end">
        <Button
          variant="secondary"
          onClick={() => {
            setValue('heading', task.heading);
            setRichText(sanitized(task.text));
            closeHandler();
          }}
        >
          Avbryt
        </Button>
        <Button
          disabled={!heading}
          onClick={() => {
            onSubmit();
          }}
        >
          Spara
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
