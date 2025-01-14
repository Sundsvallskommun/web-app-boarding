import { TemplateCard } from '@components/admin/template-card/template-card.component';
import LoaderFullScreen from '@components/loader/loader-fullscreen';
import AdminLayout from '@layouts/admin-layout/admin-layout.component';
import { useOrgTemplate } from '@services/organization-service';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

export const OrgTemplate: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const query = router.query;
  const orgid = Array.isArray(query?.orgid) ? query.orgid[0] : query.orgid || '';

  const { data, loaded, loading } = useOrgTemplate(parseInt(orgid as string, 10));

  return (
    <AdminLayout
      title={`${t('templates:templates_for_org', { org: data?.organizationName })} - ${t('common:title')} - ${t('common:admin')}`}
      postTitle={t('templates:templates_for_org', { org: data?.organizationName })}
      headerTitle={`${t('common:title')} - ${t('common:admin')}`}
    >
      {loading ?
        <LoaderFullScreen />
      : <div className="mt-40 flex flex-col gap-30">
          <h2 className="text-h2-sm md:text-h2-md xl:text-h2-lg m-0">
            {capitalize(t('templates:templates_for_org', { org: data?.organizationName }))}
          </h2>
          {loaded && (
            <div className="flex flex-wrap">
              {data?.checklists?.map((template) => (
                <TemplateCard orgId={orgid} template={template} key={template.id} />
              ))}
            </div>
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
