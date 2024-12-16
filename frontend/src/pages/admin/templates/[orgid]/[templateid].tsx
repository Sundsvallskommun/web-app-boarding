import AdminLayout from '@layouts/admin-layout/admin-layout.component';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';

export const EditTemplate = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { templateid } = router.query;
  return (
    <AdminLayout
      title={`${t('common:title')} - ${t('common:admin')}`}
      headerTitle={`${t('common:title')} - ${t('common:admin')}`}
    >
      <div>{templateid}</div>
    </AdminLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'example', 'layout', 'admin', 'checklists', 'templates'])),
  },
});

export default EditTemplate;
