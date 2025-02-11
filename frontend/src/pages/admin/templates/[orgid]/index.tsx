import { TemplateCard } from '@components/admin/template-card/template-card.component';
import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { Template, User } from '@data-contracts/backend/data-contracts';
import AdminLayout from '@layouts/admin-layout/admin-layout.component';
import { updateCommunicationChannels, useOrgTemplates, useOrgTreeStore } from '@services/organization-service';
import { createTemplate, useTemplate } from '@services/template-service/template-service';
import { useUserStore } from '@services/user-service/user-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, Switch, useConfirm, useSnackbar } from '@sk-web-gui/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { shallow } from 'zustand/shallow';

export const OrgTemplate: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const query = router.query;
  const user = useUserStore((s) => s.user, shallow);
  const orgid = Array.isArray(query?.orgid) ? query.orgid[0] : query.orgid || '';
  const confirm = useConfirm();
  const toastMessage = useSnackbar();
  const { data: orgTree } = useOrgTreeStore();

  const { setData: setTemplateData } = useTemplate('');
  const { data, loaded, loading, refresh: refreshOrgTemplates } = useOrgTemplates(parseInt(orgid as string, 10));

  useEffect(() => {
    setTemplateData(null);
  }, [orgid]);

  const editable = useCallback(
    (orgId: string, user: User) => {
      const userHasOrgPermission =
        user.role === 'department_admin' && user.children.includes(parseInt(orgid as string, 10));
      const userIsGlobalAdmin = user.role === 'global_admin';
      return userHasOrgPermission || userIsGlobalAdmin;
    },
    [data, user]
  );

  const currentTemplates: Template[] = useMemo(
    () => data?.checklists.filter((template) => ['CREATED', 'ACTIVE'].includes(template.lifeCycle)) || [],
    [data]
  );

  const onCreateTemplate = () => {
    confirm
      .showConfirmation(
        t('templates:create.title'),
        t('templates:create.text'),
        t('templates:create.confirm'),
        t('common:cancel')
      )
      .then((confirmed) => {
        if (confirmed) {
          createTemplate(orgid, orgTree, user)
            .then((res) => {
              if (res?.id) {
                router.push(`/admin/templates/${orgid}/${res.id}`);
              }
            })
            .catch((e) => {
              console.error('error', e);
              toastMessage({
                position: 'bottom',
                closeable: false,
                message: t('templates:create.error'),
                status: 'error',
              });
            });
        }
      });
  };

  const onSwitchCommunicationChannel = (orgName: string, communicationChannel: string) => {
    if (data && orgName && communicationChannel) {
      updateCommunicationChannels(data.id, orgName, communicationChannel)
        .then((res) => {
          if (res) {
            refreshOrgTemplates(res.organizationNumber);
            toastMessage({
              position: 'bottom',
              closeable: false,
              message:
                res.communicationChannels[0] === 'EMAIL' ?
                  t('templates:mail_posting.activate_success', { org: data.organizationName })
                : t('templates:mail_posting.deactivate_success', { org: data.organizationName }),
              status: 'success',
            });
          }
        })
        .catch(() => {
          toastMessage({
            position: 'bottom',
            closeable: false,
            message: t('templates:mail_posting.activate_error'),
            status: 'error',
          });
        });
    }
  };

  return (
    <AdminLayout
      title={`${t('templates:templates_for_org', { org: data?.organizationName })} - ${t('common:title')} - ${t('common:admin')}`}
      postTitle={t('templates:templates_for_org', { org: data?.organizationName })}
      headerTitle={`${t('common:title')} - ${t('common:admin')}`}
    >
      {loading || !data ?
        <LoaderFullScreen />
      : <div className="mx-32 my-40 flex justify-between">
          <div>
            <h2 className="text-h2-sm md:text-h2-md xl:text-h2-lg mb-40">{data?.organizationName}</h2>
            {loaded && (
              <div className="flex flex-wrap">
                {currentTemplates.length > 0 ?
                  currentTemplates
                    .sort((a, b) => b.version - a.version)
                    .map((template) => <TemplateCard orgId={orgid} template={template} key={template.id} />)
                : <div>
                    <p>{t('templates:no_org_template', { org: data?.organizationName })}</p>
                    {editable(orgid, user) ?
                      <Button
                        className="mt-40"
                        data-cy={`create-template-button`}
                        leftIcon={<LucideIcon name="plus" />}
                        onClick={onCreateTemplate}
                      >
                        {t('templates:create.title')}
                      </Button>
                    : null}
                  </div>
                }
              </div>
            )}
          </div>
          {currentTemplates.length > 0 && editable(orgid, user) ?
            <div className="w-[240px]">
              <div className="flex gap-12 mb-12">
                <p className="text-large">{t('templates:mail_posting.activate')}</p>
                <div>
                  <Switch
                    defaultChecked={data.communicationChannels[0] === 'EMAIL'}
                    onChange={() =>
                      onSwitchCommunicationChannel(
                        data.organizationName,
                        data.communicationChannels[0] === 'EMAIL' ? 'NO_COMMUNICATION' : 'EMAIL'
                      )
                    }
                    color="gronsta"
                    disabled={currentTemplates[0].lifeCycle === 'CREATED'}
                  />
                </div>
              </div>
              {currentTemplates[0].lifeCycle === 'CREATED' ?
                <div className="flex p-10 bg-background-200 rounded">
                  <div>
                    <LucideIcon className="mr-6" size="2rem" name="info" color="vattjom" />
                  </div>
                  <p className="p-0 m-0">{t('templates:mail_posting.activate_information')}</p>
                </div>
              : null}
            </div>
          : null}
        </div>
      }
    </AdminLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'example', 'layout', 'admin', 'checklists', 'templates'])),
  },
});

export default OrgTemplate;
