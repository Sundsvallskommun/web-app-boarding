'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useUserStore } from '@services/user-service/user-service';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export const LoginGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const user = useUserStore((s) => s.user);
  const getMe = useUserStore((s) => s.getMe);
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ userId?: string }>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!mounted || !user?.username) return;

    const isAdminRole = user.role === 'global_admin' || user.role === 'department_admin' || user.role === 'developer';

    if (!user.permissions?.isManager && params?.userId !== user.username && !isAdminRole) {
      router.push(`/${user.username}`);
      return;
    }

    if (pathname?.startsWith('/admin') && !isAdminRole) {
      router.push('/');
    }
  }, [mounted, user, params?.userId, pathname, router]);

  if (!mounted || (!user.name && !pathname?.includes('/login'))) {
    return <LoaderFullScreen />;
  }

  return <>{children}</>;
};

export default LoginGuard;
