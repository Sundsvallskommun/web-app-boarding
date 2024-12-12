import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export const Admin: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/checklists');
  }, [router]);
  return <LoaderFullScreen />;
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'example', 'layout', 'admin', 'checklists', 'templates'])),
  },
});

export default Admin;
