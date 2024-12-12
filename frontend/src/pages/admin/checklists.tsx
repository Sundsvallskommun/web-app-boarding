import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

export const Admin: React.FC = () => {
  const { t } = useTranslation();
  return (
    <DefaultLayout title={`${t('common:title')} - ${t('common:admin')}`} logoLinkHref="/admin">
      <h1 className="text-h2-sm md:text-h2-md xl:text-h2-lg">{capitalize(t('common:ongoing_introductions'))}</h1>
    </DefaultLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'example', 'layout', 'admin', 'checklists', 'templates'])),
  },
});

export default Admin;