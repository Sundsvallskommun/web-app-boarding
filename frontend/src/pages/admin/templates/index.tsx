import AdminLayout from '@layouts/admin-layout/admin-layout.component';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useTranslation } from 'react-i18next';

export const Templates: React.FC = () => {
  const { t } = useTranslation();
  return (
    <AdminLayout title={`${t('common:title')} - ${t('common:admin')}`}>
      <></>
    </AdminLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'example', 'layout', 'admin', 'checklists', 'templates'])),
  },
});

export default Templates;
