import { RichTextEditor } from '@components/rich-text-editor/rich-text-editor.component';
import { yupResolver } from '@hookform/resolvers/yup';
import { addCustomTask, updateCustomTask } from '@services/checklist-service/checklist-service';
import { useChecklist } from '@services/checklist-service/use-checklist';
import { useManagedChecklists } from '@services/checklist-service/use-managed-checklists';
import { useDelegatedChecklists } from '@services/checklist-service/use-delegated-checklists';
import { useUserStore } from '@services/user-service/user-service';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@sk-web-gui/forms';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Button, Modal, Select } from '@sk-web-gui/react';
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { shallow } from 'zustand/shallow';
import {
  CustomTaskCreateRequest,
  CustomTaskUpdateRequest,
  EmployeeChecklistTask,
} from '@data-contracts/backend/data-contracts';
import { useTranslation } from 'react-i18next';

export interface TaskModalProps {
  closeModalHandler: () => void;
  isModalOpen: boolean;
  task?: EmployeeChecklistTask;
  checklistId?: string;
  mode: 'add' | 'edit';
}

export const TaskModal: React.FC<TaskModalProps> = (props) => {
  const { closeModalHandler, isModalOpen, task, checklistId, mode } = props;
  const user = useUserStore((s) => s.user, shallow);
  const { data, refresh } = useChecklist();
  const { refresh: refreshManagedChecklists } = useManagedChecklists();
  const { refresh: refreshChecklist } = useChecklist();
  const { refresh: refreshDelegatedChecklists } = useDelegatedChecklists();
  const [richText, setRichText] = useState<string>('');
  const quillRef = useRef<ReactQuill>(null);
  const { t } = useTranslation();

  let formSchema = yup.object({
    heading: yup.string().trim().required(t('task:errors.heading')).min(1, t('task:errors.heading')),
    headingReference: yup.string(),
    text: yup.string().max(2048, t('task:errors.text')),
    questionType: yup
      .mixed<CustomTaskUpdateRequest['questionType']>()
      .required()
      .oneOf(['YES_OR_NO', 'YES_OR_NO_WITH_TEXT', 'COMPLETED_OR_NOT_RELEVANT', 'COMPLETED_OR_NOT_RELEVANT_WITH_TEXT']),
    phaseId: yup.string().when('$mode', {
      is: 'add',
      then: (schema) => schema.required('Du måste välja en fas'),
      otherwise: (schema) => schema.notRequired().default(''),
    }),
    sortOrder: yup.number().required(),
    createdBy: yup.string().when('$mode', {
      is: 'add',
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired().default(''),
    }),
    updatedBy: yup.string().required(),
  });

  const formControl = useForm({
    defaultValues: {
      heading: '',
      headingReference: '',
      text: '',
      questionType: 'YES_OR_NO' as CustomTaskUpdateRequest['questionType'],
      phaseId: data?.phases?.[0]?.id || '',
      createdBy: '',
      updatedBy: '',
      sortOrder: data?.phases?.[0]?.tasks?.length || 0,
    },
    resolver: yupResolver(formSchema),
    context: { mode },
  });

  const {
    register,
    setFocus,
    setValue,
    getValues,
    reset,
    handleSubmit,
    formState: { errors },
  } = formControl;

  useEffect(() => {
    if (mode === 'edit' && task) {
      reset({
        heading: task.heading,
        headingReference: task.headingReference,
        text: task.text,
        questionType: task.questionType,
        updatedBy: user.username,
        sortOrder: task.sortOrder,
      });
      setRichText(task.text || '');
    } else {
      reset({
        heading: '',
        headingReference: '',
        text: '',
        questionType: 'YES_OR_NO',
        phaseId: '',
        createdBy: user.username,
        updatedBy: user.username,
        sortOrder: data?.phases[0].tasks.length,
      });
      setRichText('');
    }
    setTimeout(() => {
      setFocus(mode === 'edit' ? 'heading' : 'phaseId');
    }, 0);
  }, [isModalOpen, mode, task]);

  const onSubmit: SubmitHandler<CustomTaskCreateRequest | CustomTaskUpdateRequest> = async (data) => {
    try {
      if (mode === 'edit' && checklistId && task?.id) {
        await updateCustomTask(checklistId, task.id, data as CustomTaskUpdateRequest);
        refreshManagedChecklists();
        refreshChecklist();
        refreshDelegatedChecklists();
        closeModalHandler();
      } else if (mode === 'add' && checklistId) {
        await addCustomTask(checklistId, getValues('phaseId') || '', user.username, data as CustomTaskCreateRequest);
        refresh();
        refreshManagedChecklists();
        closeModalHandler();
      }
    } catch (error) {
      console.error('Error during form submission:', error);
    }
  };

  const onRichTextChange = (val: string) => {
    if (quillRef.current) {
      const editor = quillRef.current.getEditor();
      const length = editor.getLength();
      setRichText(val);
      setValue('text', length > 1 ? val : '');
    }
  };

  const onError = (error: any) => {
    console.error(error);
  };
  return (
    <Modal
      show={isModalOpen}
      onClose={closeModalHandler}
      className="w-[70rem] p-32"
      label={
        <h4 className="text-label-medium">{mode === 'edit' ? t('task:edit_activity') : t('task:create.title')}</h4>
      }
    >
      <FormProvider {...formControl}>
        <form>
          <Modal.Content className="mb-24">
            {mode === 'add' && (
              <FormControl className="w-full">
                <FormLabel>Fas (obligatorisk)</FormLabel>
                <Select
                  {...register('phaseId')}
                  data-cy="add-activity-phase-select"
                  onChange={(e) => {
                    data && setValue('sortOrder', data?.phases[e.currentTarget.selectedIndex].tasks.length);
                  }}
                >
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
              </FormControl>
            )}

            <FormControl className="w-full" required>
              <FormLabel showRequired={false} className="mt-16">
                {t('task:heading')}
              </FormLabel>
              <Input {...register('heading')} data-cy="activity-heading" />
              {errors.heading && (
                <FormErrorMessage className="text-error" data-cy="activity-heading-error">
                  <Icon size="1.5rem" name="info" /> {errors.heading?.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormLabel className="mt-16">{t('task:link')}</FormLabel>
            <Input {...register('headingReference')} data-cy="activity-heading-reference" />
            <p className="text-small my-0">{t('task:link_description')}</p>

            <FormControl className="w-full">
              <FormLabel className="mt-16">{t('task:text')}</FormLabel>
              <div className="mb-16" data-cy="activity-text">
                <RichTextEditor
                  ref={quillRef}
                  containerLabel="text"
                  value={richText}
                  onChange={(value) => {
                    return onRichTextChange(value);
                  }}
                />
              </div>
            </FormControl>
          </Modal.Content>

          <Modal.Footer className="flex justify-between items-center">
            <div className="flex gap-4">
              <Button
                data-cy="activity-cancel-button"
                variant="secondary"
                onClick={() => {
                  setValue('heading', task?.heading || '');
                  setValue('text', task?.text || '');
                  closeModalHandler();
                }}
              >
                {t('common:cancel')}
              </Button>
              <Button data-cy="activity-save-button" onClick={handleSubmit(onSubmit, onError)}>
                {mode === 'edit' ? t('common:save') : t('common:add')}
              </Button>
            </div>
            {errors.text && (
              <FormErrorMessage className="text-error flex items-center">
                <Icon size="1.5rem" name="info" className="mr-2" />
                <p className="text-left">{errors.text?.message}</p>
              </FormErrorMessage>
            )}
          </Modal.Footer>
        </form>
      </FormProvider>
    </Modal>
  );
};
