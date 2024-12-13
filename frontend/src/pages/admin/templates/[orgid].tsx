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
  const { orgid } = router.query;

  const { data, loaded, loading } = useOrgTemplate(parseInt(orgid as string, 10));

  return (
    <AdminLayout title={`${t('common:title')} - ${t('common:admin')}`}>
      {loading ?
        <LoaderFullScreen />
      : <>
          <h1 className="text-h2-sm md:text-h2-md xl:text-h2-lg">
            {capitalize(t('common:ongoing_introductions'))} {orgid}
          </h1>
          {loaded && <p>{data?.organizationName}</p>}
        </>
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
