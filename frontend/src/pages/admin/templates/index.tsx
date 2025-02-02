import AdminLayout from '@layouts/admin-layout/admin-layout.component';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

export const Templates: React.FC = () => {
  const { t } = useTranslation();
  return (
    <AdminLayout title={`${t('common:title')} - ${t('common:admin')}`}>
      <h1 className="mt-40 text-h2-sm md:text-h2-md xl:text-h2-lg">{capitalize(t('common:ongoing_introductions'))}</h1>
    </AdminLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'example', 'layout', 'admin', 'checklists', 'templates'])),
  },
});

export default Templates;
