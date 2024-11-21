import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { Button, Link } from '@sk-web-gui/react';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import { OngoingChecklistsTable } from '@components/ongoing-checklists-table/ongoing-checklists-table.component';
import { useAppContext } from '@contexts/app.context';
import { getChecklistsAsManager, getDelegatedChecklists } from '@services/checklist-service/checklist-service';
import { Spinner } from '@sk-web-gui/spinner';
import { DelegateMultipleChecklistsModal } from '@components/delegate-checklists-modal/delegate-checklists-modal.component';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import Divider from '@sk-web-gui/divider';
import { useUserStore } from '@services/user-service/user-service';
import { shallow } from 'zustand/shallow';

export const Start: React.FC = () => {
  const user = useUserStore((s) => s.user, shallow);
  const { asManagerChecklists, setAsManagerChecklists, delegatedChecklists, setDelegatedChecklists } = useAppContext();
  const methods = useForm();
  const { control, register, watch, setValue } = useForm();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const { fields, append, remove } = useFieldArray({
    control,
    keyName: 'fieldId',
    name: 'checklists',
  });

  useEffect(() => {
    getChecklistsAsManager(user.username).then((res) => {
      setAsManagerChecklists(res);
    });

    getDelegatedChecklists(user.username).then((res) => {
      setDelegatedChecklists(res.employeeChecklists);
    });
  }, []);

  const openHandler = () => {
    setIsOpen(true);
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME} - Start`}>
      <Main>
        <div className="py-10 px-10 2xl:px-0">
          <div className="py-24 flex">
            <div className="w-1/2">
              <h2>Pågående introduktioner</h2>
            </div>

            <div className="w-1/2 text-right">
              <Button color="vattjom" onClick={openHandler}>
                Delegera checklista
              </Button>
            </div>
          </div>

          {asManagerChecklists ?
            <FormProvider {...methods}>
              <OngoingChecklistsTable
                data={asManagerChecklists}
                delegatedChecklists={false}
                fields={fields}
                append={append}
                remove={remove}
                register={register}
                watch={watch}
              />
            </FormProvider>
          : <Spinner />}

          {delegatedChecklists.length ?
            <div className="py-24">
              <h2 className="mb-16">Delegerade introduktioner</h2>
              {asManagerChecklists ?
                <OngoingChecklistsTable
                  data={delegatedChecklists}
                  delegatedChecklists={true}
                  fields={fields}
                  append={append}
                  remove={remove}
                  register={register}
                  watch={watch}
                />
              : <Spinner />}
            </div>
          : null}

          {user.name ?
            <NextLink href={`/logout`}>
              <Link as="span" variant="link">
                Logga ut
              </Link>
            </NextLink>
          : ''}
        </div>
        {fields.length ?
          <div className="absolute bottom-0 rounded-button bg-inverted-background-content text-white font-bold py-16 px-24 flex">
            <span className="content-center mr-8">
              {fields.length} {fields.length > 1 ? 'valda' : 'vald'}
            </span>
            <Button
              className="mx-16"
              onClick={() => {
                setValue('checkAll', false);
                remove();
              }}
              variant="secondary"
              inverted
            >
              Avmarkera alla
            </Button>
            <Divider className="mx-16 my-0 mr-32 bg-inverted-divider" orientation="vertical" />
            <Button color="primary" inverted onClick={openHandler}>
              Delegera
            </Button>
          </div>
        : null}

        <FormProvider {...methods}>
          <DelegateMultipleChecklistsModal fields={fields} closeHandler={closeHandler} isOpen={isOpen} />
        </FormProvider>
      </Main>
    </DefaultLayout>
  );
};

export default Start;
