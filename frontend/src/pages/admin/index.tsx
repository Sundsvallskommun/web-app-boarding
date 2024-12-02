import AdminLayout from '@layouts/admin-layout/admin-layout.component';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

export const Admin: React.FC = () => {
  const { t } = useTranslation();
  return (
    <AdminLayout title={`${t('common:title')} - ${t('common:admin')}`}>
      <h1 className="text-h2-sm md:text-h2-md xl:text-h2-lg">{capitalize(t('common:ongoing_introductions'))}</h1>
    </AdminLayout>
  );
};

export const getServerSideProps = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'example', 'layout', 'admin'])),
  },
});

export default Admin;
