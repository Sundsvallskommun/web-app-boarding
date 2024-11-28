import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useAppContext } from '@contexts/app.context';
import { useUserStore } from '@services/user-service/user-service';
import { shallow } from 'zustand/shallow';
import { FormProvider, useForm } from 'react-hook-form';
import { getChecklistsAsManager } from '@services/checklist-service/checklist-service';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { OngoingChecklistsTable } from '@components/ongoing-checklists-table/ongoing-checklists-table.component';
import { Spinner } from '@sk-web-gui/spinner';
import { Button } from '@sk-web-gui/react';
import Divider from '@sk-web-gui/divider';
import { DelegateMultipleChecklistsModal } from '@components/delegate-checklists-modal/delegate-checklists-modal.component';

export default function Index() {
  const user = useUserStore((s) => s.user, shallow);
  const router = useRouter();
  const { asManagerChecklists, setAsManagerChecklists, delegatedChecklists } = useAppContext();
  const methods = useForm();
  const { register, watch, setValue } = useForm<{ checkAll: boolean; checked: [] }>({
    defaultValues: { checkAll: false, checked: [] },
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { checked } = watch();

  useEffect(() => {
    getChecklistsAsManager(user.username).then((res) => {
      res.length > 0 ? setAsManagerChecklists(res) : router.push(`/${user.username}`);
    });
  }, []);

  const openHandler = () => {
    setIsOpen(true);
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    asManagerChecklists.length && (
      <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME}`}>
        <Main>
          <div className="py-10 px-10 2xl:px-0">
            <h2 className="my-16">Pågående introduktioner</h2>
            <p className="mb-16">
              Du har {asManagerChecklists.length} pågående
              {asManagerChecklists.length === 1 ? ' introduktion' : ' introduktioner'}
            </p>

            {asManagerChecklists ?
              <FormProvider {...methods}>
                <OngoingChecklistsTable
                  data={asManagerChecklists}
                  delegatedChecklists={false}
                  register={register}
                  watch={watch}
                  setValue={setValue}
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
                    register={register}
                    watch={watch}
                    setValue={setValue}
                  />
                : <Spinner />}
              </div>
            : null}
          </div>
          {checked.length ?
            <div className="flex w-full justify-center">
              <div className="absolute bottom-40 rounded-button bg-inverted-background-content text-white font-bold py-16 px-24 flex">
                <span className="content-center mr-8">
                  {checked.length} {checked.length > 1 ? 'valda' : 'vald'}
                </span>
                <Button
                  className="mx-16"
                  onClick={() => {
                    setValue('checkAll', false);
                    setValue('checked', []);
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
            </div>
          : null}

          <FormProvider {...methods}>
            <DelegateMultipleChecklistsModal checklistIds={checked} closeHandler={closeHandler} isOpen={isOpen} />
          </FormProvider>
        </Main>
      </DefaultLayout>
    )
  );
}
