import { RichTextEditor } from '@components/rich-text-editor/rich-text-editor.component';
import { Task, TaskCreateRequest, TaskUpdateRequest } from '@data-contracts/backend/data-contracts';
import { yupResolver } from '@hookform/resolvers/yup';
import { useOrgTreeStore } from '@services/organization-service';
import { createTask, updateTask, useTemplate } from '@services/template-service/template-service';
import { useUserStore } from '@services/user-service/user-service';
import { FormControl, FormErrorMessage, FormLabel, Input } from '@sk-web-gui/forms';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { Button, Checkbox, Modal, useSnackbar } from '@sk-web-gui/react';
import { findOrgInTree } from '@utils/find-org-in-tree';
import { useCrudHelper } from '@utils/use-crud-helpers';
import { useTranslation } from 'next-i18next';
import router from 'next/router';
import React, { useEffect } from 'react';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { shallow } from 'zustand/shallow';

interface AdminEditTaskModalProps {
  closeHandler: () => void;
  isOpen: boolean;
  task: Omit<Task, 'created' | 'updated' | 'lastSavedBy'>;
  templateId: string;
  phaseId: string;
}

export const AdminEditTaskModal: React.FC<AdminEditTaskModalProps> = (props) => {
  const { closeHandler, isOpen, task, templateId, phaseId } = props;
  const { orgid } = router.query;
  const user = useUserStore((s) => s.user, shallow);
  const { data: orgTreeData } = useOrgTreeStore();
  const { t } = useTranslation();
  const { refresh } = useTemplate(templateId);
  const { handleUpdate, handleCreate } = useCrudHelper('task');
  const toastMessage = useSnackbar();
  let formSchema = yup.object({
    heading: yup.string().min(1, t('task:errors.heading')).required(t('task:errors.heading')),
    headingReference: yup.string().optional(),
    text: yup.string().optional().max(2048, t('task:errors.text')),
    sortOrder: yup.number().required(),
    roleType: yup
      .mixed<TaskUpdateRequest['roleType']>()
      .required()
      .oneOf(['NEW_EMPLOYEE', 'NEW_MANAGER', 'MANAGER_FOR_NEW_EMPLOYEE', 'MANAGER_FOR_NEW_MANAGER']),
    permission: yup.mixed<TaskUpdateRequest['permission']>().required().oneOf(['SUPERADMIN', 'ADMIN']),
    questionType: yup
      .mixed<TaskUpdateRequest['questionType']>()
      .required()
      .oneOf(['YES_OR_NO', 'YES_OR_NO_WITH_TEXT', 'COMPLETED_OR_NOT_RELEVANT', 'COMPLETED_OR_NOT_RELEVANT_WITH_TEXT']),
    updatedBy: yup.string().required(),
    createdBy: yup.string().required(),
  });

  const org = findOrgInTree(Object.values(orgTreeData), parseInt(orgid as string, 10));
  const level = org?.treeLevel || 0;

  const formControl = useForm<TaskCreateRequest & TaskUpdateRequest>({
    defaultValues: {
      heading: '',
      headingReference: '',
      text: '',
      sortOrder: 1000 * level,
      roleType: 'NEW_EMPLOYEE' as TaskUpdateRequest['roleType'],
      permission: 'SUPERADMIN' as TaskUpdateRequest['permission'],
      questionType: 'YES_OR_NO' as TaskUpdateRequest['questionType'],
      updatedBy: '',
      createdBy: '',
    },
    resolver: yupResolver(formSchema),
  });

  const {
    register,
    setValue,
    getValues,
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = formControl;

  const text = watch('text');

  useEffect(() => {
    reset({
      heading: task?.heading,
      headingReference: task?.headingReference,
      text: task?.text,
      roleType: task?.roleType,
      permission: task?.permission,
      questionType: task?.questionType,
      updatedBy: user.username,
      createdBy: user.username,
      sortOrder: parseInt(task?.sortOrder || '0', 10) || 0,
    });
  }, [task]);

  const onError = (error: any) => {
    console.error(error);
  };

  const onSubmit: SubmitHandler<TaskUpdateRequest | TaskCreateRequest> = (data) => {
    if (task.id && task.id !== '') {
      handleUpdate(() => {
        return updateTask(orgid as string, templateId, phaseId, task.id, data as TaskUpdateRequest)
          .then(() => {
            refresh(templateId);
          })
          .catch(() => {
            console.error('Something went wrong when updating task.');
            toastMessage({
              position: 'bottom',
              closeable: false,
              message: t('task:update.error'),
              status: 'error',
            });
          });
      });
    } else {
      handleCreate(() => {
        if (!org?.orgId) {
          return Promise.reject('Organization not found');
        }
        return createTask(org.orgId, templateId, phaseId, data as TaskCreateRequest)
          .then(() => {
            refresh(templateId);
          })
          .catch(() => {
            console.error('Something went wrong when creating task.');
            toastMessage({
              position: 'bottom',
              closeable: false,
              message: t('task:create.error'),
              status: 'error',
            });
          });
      });
    }

    closeHandler();
  };

  const onRichTextChange = (val: string) => {
    setValue('text', val.length ? val : '');
  };

  return (
    <Modal
      data-cy="edit-task-modal"
      show={isOpen}
      onClose={closeHandler}
      className="w-[70rem] p-32"
      label={<h4 className="text-label-medium">{task.id ? t('task:edit_activity') : t('task:add_activity')}</h4>}
    >
      <FormProvider {...formControl}>
        <form onSubmit={handleSubmit(onSubmit)} data-cy="edit-task-form">
          <Modal.Content className="mb-24">
            <Input type="hidden" value="ADMIN" {...register('permission')} />

            <Checkbox
              defaultChecked={
                task.id ? task.roleType === 'MANAGER_FOR_NEW_MANAGER' || task.roleType === 'NEW_MANAGER' : false
              }
              onChange={() => {
                if (
                  getValues().roleType === 'MANAGER_FOR_NEW_EMPLOYEE' ||
                  getValues().roleType === 'MANAGER_FOR_NEW_MANAGER'
                ) {
                  getValues().roleType === 'MANAGER_FOR_NEW_EMPLOYEE' ?
                    setValue('roleType', 'MANAGER_FOR_NEW_MANAGER')
                  : setValue('roleType', 'MANAGER_FOR_NEW_EMPLOYEE');
                } else {
                  getValues().roleType === 'NEW_EMPLOYEE' ?
                    setValue('roleType', 'NEW_MANAGER')
                  : setValue('roleType', 'NEW_EMPLOYEE');
                }
              }}
              data-cy="role-type-checkbox"
            >
              {t('task:manager_activity')}
            </Checkbox>

            <FormControl className="w-full">
              <FormLabel showRequired={false} className="mt-16">
                {t('task:heading')}
              </FormLabel>
              <Input data-cy="activity-heading-input" {...register('heading')} />
              {errors.heading && (
                <FormErrorMessage className="text-error">
                  <Icon size="1.5rem" name="info" /> {errors.heading?.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl className="w-full">
              <FormLabel showRequired={false} className="mt-16">
                {t('task:heading_reference')}
              </FormLabel>
              <Input data-cy="activity-heading-reference-input" {...register('headingReference')} />
              {errors.headingReference && (
                <FormErrorMessage className="text-error">
                  <Icon size="1.5rem" name="info" /> {errors.headingReference?.message}
                </FormErrorMessage>
              )}
            </FormControl>
            <FormControl className="w-full" data-cy="activity-description">
              <FormLabel className="mt-16">{t('task:text')}</FormLabel>
              <RichTextEditor
                data-cy="activity-description-input"
                containerLabel="text"
                value={text || ''}
                onChange={onRichTextChange}
              />
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
                  closeHandler();
                }}
              >
                {t('common:cancel')}
              </Button>
              <Button data-cy="activity-save-button" type="submit" onClick={handleSubmit(onSubmit, onError)}>
                {task.id ? t('common:save') : t('common:add')}
              </Button>
              {errors.text && (
                <FormErrorMessage className="text-error flex items-center">
                  <Icon size="1.5rem" name="info" className="mr-4 ml-2" />
                  <p>{errors.text?.message}</p>
                </FormErrorMessage>
              )}
            </div>
          </Modal.Footer>
        </form>
      </FormProvider>
    </Modal>
  );
};
