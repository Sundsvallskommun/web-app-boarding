import { RichTextEditor } from '@components/rich-text-editor/rich-text-editor.component';
import { yupResolver } from '@hookform/resolvers/yup';
import { updateCustomTask } from '@services/checklist-service/checklist-service';
import { useChecklist } from '@services/checklist-service/use-checklist';
import { useManagedChecklists } from '@services/checklist-service/use-managed-checklists';
import { useUserStore } from '@services/user-service/user-service';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@sk-web-gui/forms';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Button, Modal } from '@sk-web-gui/react';
import { useTranslation } from 'next-i18next';
import { useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { shallow } from 'zustand/shallow';

export const EditTaskModal = ({ closeHandler, isOpen, task, checklistId }) => {
  const user = useUserStore((s) => s.user, shallow);
  const { t } = useTranslation();
  const { refresh: refreshManagedChecklists } = useManagedChecklists();
  const { refresh: refreshChecklist } = useChecklist();
  let formSchema = yup.object({
    heading: yup.string().min(1, t('task:errors.heading')).required(t('task:errors.heading')),
    text: yup.string(),
    questionType: yup.string().required(),
    sortOrder: yup.number().required(),
    updatedBy: yup.string().required(),
  });

  const formControl = useForm({
    defaultValues: {
      heading: '',
      text: '',
      questionType: '',
      updatedBy: '',
      sortOrder: 0,
    },
    resolver: yupResolver(formSchema),
  });

  const {
    register,
    setValue,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = formControl;

  const text = watch('text');

  useEffect(() => {
    reset({
      heading: task.heading,
      text: task.text,
      questionType: task.questionType,
      updatedBy: user.username,
      sortOrder: 0,
    });
  }, [task]);

  const onSubmit = (data) => {
    updateCustomTask(checklistId, task.id, data).then(() => {
      refreshManagedChecklists();
      refreshChecklist();
    });

    closeHandler();
  };

  const onRichTextChange = (val, delta, source, editor) => {
    setValue('text', val);
  };

  return (
    <Modal show={isOpen} onClose={closeHandler} className="w-[70rem] p-32" label={<h4>Redigera aktivitet</h4>}>
      <FormProvider {...formControl}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Modal.Content className="mb-24">
            <FormControl className="w-full" required>
              <FormLabel showRequired={false} className="mt-16">
                Rubrik (obligatorisk)
              </FormLabel>
              <Input {...register('heading')} />
              {errors.heading && (
                <FormErrorMessage className="text-error">
                  <Icon size="1.5rem" name="info" /> {errors.heading?.message}
                </FormErrorMessage>
              )}
            </FormControl>

            {/* TODO missing in API?
            <FormLabel>Länk</FormLabel>
            <Input {...register('link')} className="mb-16" />*/}

            <FormControl className="w-full">
              <FormLabel className="mt-16">Brödtext</FormLabel>
              <RichTextEditor containerLabel="text" value={text} onChange={onRichTextChange} />
            </FormControl>
          </Modal.Content>

          <Modal.Footer className="justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setValue('heading', task.heading);
                setValue('text', task.text);
                closeHandler();
              }}
            >
              {t('common:cancel')}
            </Button>
            <Button type="submit">{t('common:save')}</Button>
          </Modal.Footer>
        </form>
      </FormProvider>
    </Modal>
  );
};
