'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

export const Admin: React.FC = () => {
  const router = useRouter();

  useEffect(() => {
    router.push('/admin/checklists');
  }, [router]);
  return <LoaderFullScreen />;
};

export default Admin;
