import { TemplateCard } from '@components/admin/template-card/template-card.component';
import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { Template } from '@data-contracts/backend/data-contracts';
import AdminLayout from '@layouts/admin-layout/admin-layout.component';
import { useOrgTemplates, useOrgTree, useOrgTreeStore } from '@services/organization-service';
import { createTemplate, useTemplate } from '@services/template-service/template-service';
import { useUserStore } from '@services/user-service/user-service';
import LucideIcon from '@sk-web-gui/lucide-icon';
import { Button, useConfirm, useSnackbar } from '@sk-web-gui/react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';
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
  const { data, loaded, loading } = useOrgTemplates(parseInt(orgid as string, 10));

  useEffect(() => {
    setTemplateData(null);
  }, [orgid]);

  const currentTemplates: Template[] = useMemo(
    () => data?.checklists.filter((template) => ['CREATED', 'ACTIVE'].includes(template.lifeCycle)) || [],
    [data]
  );
  const oldTemplates: Template[] = useMemo(
    () => data?.checklists.filter((template) => !['CREATED', 'ACTIVE'].includes(template.lifeCycle)) || [],
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

  return (
    <AdminLayout
      title={`${t('templates:templates_for_org', { org: data?.organizationName })} - ${t('common:title')} - ${t('common:admin')}`}
      postTitle={t('templates:templates_for_org', { org: data?.organizationName })}
      headerTitle={`${t('common:title')} - ${t('common:admin')}`}
    >
      {loading || !data ?
        <LoaderFullScreen />
      : <div className="mt-40 flex flex-col gap-30">
          <h2 className="text-h2-sm md:text-h2-md xl:text-h2-lg m-0">
            {capitalize(t('templates:templates_for_org', { org: data?.organizationName }))}
          </h2>
          {loaded && (
            <>
              <div className="flex flex-wrap gap-12">
                {currentTemplates.length > 0 ?
                  currentTemplates
                    .sort((a, b) => b.version - a.version)
                    .map((template) => <TemplateCard orgId={orgid} template={template} key={template.id} />)
                : <div>
                    <p>Inga aktiva mallar</p>
                    <Button
                      size="lg"
                      className="mt-8 ml-24"
                      data-cy={`create-template-button`}
                      leftIcon={<LucideIcon name="plus" />}
                      variant="tertiary"
                      showBackground={false}
                      color="info"
                      onClick={onCreateTemplate}
                    >
                      {t('templates:create.title')}
                    </Button>
                  </div>
                }
              </div>
              <h3>Gamla versioner</h3>
              <div className="flex flex-wrap gap-12">
                {oldTemplates.length > 0 ?
                  oldTemplates
                    .sort((a, b) => b.version - a.version)
                    .map((template) => <TemplateCard orgId={orgid} template={template} key={template.id} />)
                : <p>Inga gamla versioner</p>}
              </div>
            </>
          )}
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
