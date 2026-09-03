'use client';

import AdminLayout from '@layouts/admin-layout/admin-layout.component';
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

export default Templates;
