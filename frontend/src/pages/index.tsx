import { DelegateMultipleChecklistsModal } from '@components/delegate-checklists-modal/delegate-checklists-modal.component';
import { OngoingChecklistsTable } from '@components/ongoing-checklists-table/ongoing-checklists-table.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { useManagedChecklists } from '@services/checklist-service/use-managed-checklists';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';
import { useChecklist } from '@services/checklist-service/use-checklist';
import { useUserStore } from '@services/user-service/user-service';
import { useShallow } from 'zustand/react/shallow';
import { Avatar, Button } from '@sk-web-gui/react';
import { LucideIcon as Icon } from '@sk-web-gui/lucide-icon';
import { useRouter } from 'next/router';
import { countAllCompletedTasks, countAllTasks } from '@utils/count-tasks';
import { useDelegatedChecklists } from '@services/checklist-service/use-delegated-checklists';

export function Index() {
  const router = useRouter();
  const { t } = useTranslation();
  const methods = useForm<{ checkAll: boolean; checked: [] }>({
    defaultValues: { checkAll: false, checked: [] },
  });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const { checked } = methods.watch();
  const { username } = useUserStore(useShallow((s) => s.user));

  const { data: managedChecklists, loaded: managedChecklistsLoaded } = useManagedChecklists();
  const { data: checklist, loaded: checklistLoaded } = useChecklist(username);
  const { data: delegatedChecklists, loaded: delegatedChecklistsLoaded } = useDelegatedChecklists();

  const closeHandler = () => {
    setIsOpen(false);
  };

  return (
    delegatedChecklistsLoaded && (
      <DefaultLayout title={`${process.env.NEXT_PUBLIC_APP_NAME}`}>
        <Main>
          <div className="py-10 px-10 2xl:px-0">
            {checklist && checklistLoaded ?
              <div className="flex justify-between border-1 border-divider rounded-button bg-background-content px-16 pt-16 pb-16 mb-40 w-1/3">
                <div className="flex">
                  <Avatar
                    rounded
                    initials={`${checklist.employee.firstName[0]}${checklist.employee.lastName[0]}`}
                    size="md"
                  />
                  <div className="px-16">
                    <strong>
                      {checklist.employee.firstName} {checklist.employee.lastName}
                    </strong>
                    <p className="text-small my-0">
                      <Icon name="check" size="1.8rem" className="align-top mr-6" />
                      {t('task:activities_completed', {
                        first: countAllCompletedTasks(checklist),
                        second: countAllTasks(checklist),
                      })}
                    </p>
                  </div>
                </div>

                <div>
                  <Button
                    iconButton
                    leftIcon={<Icon name="arrow-right" />}
                    onClick={() => {
                      router.push(`/${username}`);
                    }}
                  />
                </div>
              </div>
            : null}

            {managedChecklists.length ?
              <>
                <h2 className="my-16">{capitalize(t('checklists:ongoing_checklists'))}</h2>
                <p className="mb-16">
                  {t('checklists:you_got_ongoing_checklists', { count: managedChecklists?.length })}
                </p>

                <FormProvider {...methods}>
                  <OngoingChecklistsTable data={managedChecklists} delegatedChecklists={false} />
                </FormProvider>
              </>
            : null}

            {delegatedChecklists.length ?
              <div className="py-24">
                <h2 className="mb-16">{t('common:assigned_introductions')}</h2>
                <p className="mb-16">
                  {t('checklists:you_got_assigned_introductions', { count: delegatedChecklists?.length })}
                </p>
                {delegatedChecklists ?
                  <OngoingChecklistsTable data={delegatedChecklists} delegatedChecklists={true} />
                : null}
              </div>
            : null}
          </div>

          <FormProvider {...methods}>
            <DelegateMultipleChecklistsModal checklistIds={checked} onClose={closeHandler} isOpen={isOpen} />
          </FormProvider>
        </Main>
      </DefaultLayout>
    )
  );
}

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'layout', 'crud', 'checklists', 'delegation', 'task'])),
  },
});

export default Index;
