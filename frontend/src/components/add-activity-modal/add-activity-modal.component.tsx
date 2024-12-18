import { RichTextEditor } from '@components/rich-text-editor/rich-text-editor.component';
import { yupResolver } from '@hookform/resolvers/yup';
import { addCustomTask } from '@services/checklist-service/checklist-service';
import { useChecklist } from '@services/checklist-service/use-checklist';
import sanitized from '@services/sanitizer-service';
import { useUserStore } from '@services/user-service/user-service';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@sk-web-gui/forms';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Button, Modal, Select } from '@sk-web-gui/react';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { shallow } from 'zustand/shallow';
import { CustomTaskCreateRequest } from '@data-contracts/backend/data-contracts';
import ReactQuill from 'react-quill';
import { useTranslation } from 'react-i18next';

let formSchema = yup.object({
  heading: yup.string().min(1, 'Du måste skriva en rubrik').required('Du måste skriva en rubrik'),
  text: yup.string(),
  questionType: yup.string(),
  phaseId: yup.string().required('Du måste välja en fas'),
  sortOrder: yup.number().required(),
  createdBy: yup.string().required(),
});

export const AddActivityModal: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const { data, refresh } = useChecklist();
  const [richText, setRichText] = useState<string>('');
  const quillRef = useRef<ReactQuill>(null);
  const { t } = useTranslation();

  const formControl = useForm({
    defaultValues: {
      heading: '',
      text: '',
      questionType: 'YES_OR_NO',
      phaseId: '',
      createdBy: '',
      sortOrder: 0,
    },
    resolver: yupResolver(formSchema),
  });

  const {
    register,
    setFocus,
    setValue,
    getValues,
    trigger,
    watch,
    reset,
    formState: { errors },
  } = formControl;

  const { heading, phaseId } = watch();

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openHandler = () => {
    setIsOpen(true);
  };
  const closeHandler = () => {
    reset();
    setRichText('');
    setIsOpen(false);
  };

  useEffect(() => {
    setTimeout(() => {
      setFocus('phaseId');
    }, 0);
  }, [isOpen]);

  const onSubmit = () => {
    data &&
      addCustomTask(data.id, getValues('phaseId'), user.username, getValues() as CustomTaskCreateRequest).then(() => {
        refresh();
        closeHandler();
      });
  };

  const onRichTextChange = (val: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const length = editor.getLength();
      setRichText(val);
      setValue('text', sanitized(length > 1 ? val : ''));
    }
  };

  return (
    <div>
      <Button variant="primary" color="vattjom" onClick={openHandler} inverted>
        <Icon name="plus" size="18px" /> {t('task:add_activity')}
      </Button>

      <Modal
        show={isOpen}
        onClose={closeHandler}
        className="w-[70rem] p-32"
        label={<h4 className="text-label-medium">{t('task:add_activity')}</h4>}
      >
        <Modal.Content>
          <FormControl className="w-full">
            <FormLabel>Fas (obligatorisk)</FormLabel>
            <Select {...register('phaseId')} onBlur={() => trigger('phaseId')}>
              <Select.Option value="" disabled>
                {t('task:choose_phase')}
              </Select.Option>
              {data?.phases?.map((phase) => {
                return (
                  <Select.Option key={`employee-${phase.id}`} value={phase.id}>
                    {phase.name}
                  </Select.Option>
                );
              })}
            </Select>
            {errors.phaseId && (
              <FormErrorMessage className="text-error">
                <Icon size="1.5rem" name="info" /> {errors.phaseId?.message}
              </FormErrorMessage>
            )}

            <FormLabel className="mt-16">{t('task:heading')}</FormLabel>
            <Input {...register('heading', { required: true })} onBlur={() => trigger('heading')} />
            {errors.heading && (
              <FormErrorMessage className="text-error">
                <Icon size="1.5rem" name="info" /> {errors.heading?.message}
              </FormErrorMessage>
            )}

            {/* TODO missing in API?
            <FormLabel>Länk</FormLabel>
            <Input {...register('link')} className="mb-16" />*/}

            <FormLabel className="mt-16">{t('task:text')}</FormLabel>
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
          <Button variant="secondary" onClick={closeHandler}>
            {t('common:cancel')}
          </Button>
          <Button
            disabled={!phaseId || !heading}
            onClick={() => {
              onSubmit();
            }}
          >
            {t('common:add')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};
