import { DelegateMultipleChecklistsModal } from '@components/delegate-checklists-modal/delegate-checklists-modal.component';
import { OngoingChecklistsTable } from '@components/ongoing-checklists-table/ongoing-checklists-table.component';
import { useAppContext } from '@contexts/app.context';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useManagedChecklists } from '@services/checklist-service/use-managed-checklists';
import Divider from '@sk-web-gui/divider';
import { Button } from '@sk-web-gui/react';
import { Spinner } from '@sk-web-gui/spinner';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

export function Index() {
  const { t } = useTranslation();
  const { delegatedChecklists } = useAppContext();
  const methods = useForm();
  const { register, watch, setValue } = useForm<{ checkAll: boolean; checked: [] }>({
    defaultValues: { checkAll: false, checked: [] },
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { checked } = watch();

  const { data: managedChecklists, loaded: managedChecklistsLoaded } = useManagedChecklists();

  const openHandler = () => {
    setIsOpen(true);
  };

  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    managedChecklistsLoaded && (
      <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME}`}>
        <Main>
          <div className="py-10 px-10 2xl:px-0">
            <h2 className="my-16">{capitalize(t('checklists:ongoing_checklists'))}</h2>
            <p className="mb-16">{t('checklists:you_got_ongoing_checklists', { count: managedChecklists?.length })}</p>

            {managedChecklists ?
              <FormProvider {...methods}>
                <OngoingChecklistsTable
                  data={managedChecklists}
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
                {managedChecklists ?
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
            <DelegateMultipleChecklistsModal checklistIds={checked} onClose={closeHandler} isOpen={isOpen} />
          </FormProvider>
        </Main>
      </DefaultLayout>
    )
  );
}

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'layout', 'crud', 'checklists'])),
  },
});

export default Index;
