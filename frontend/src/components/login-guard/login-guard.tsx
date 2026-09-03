'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useAppContext } from '@contexts/app.context';
import { useUserStore } from '@services/user-service/user-service';
import { useParams, usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

export const LoginGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const user = useUserStore((s) => s.user);
  const getMe = useUserStore((s) => s.getMe);
  const resetUser = useUserStore((s) => s.reset);
  const { setDefaults } = useAppContext();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams<{ userId?: string }>();
  const [mounted, setMounted] = useState(false);

  const logout = () => {
    setDefaults();
    resetUser();
    localStorage.clear();
  };

  useEffect(() => {
    const checkAuth = async () => {
      const res = await getMe();
      if (res.error && !pathname?.includes('/login')) {
        logout();
        router.push(`/login?failMessage=${encodeURIComponent(res.message ?? String(res.error))}`);
      }
    };
    setMounted(true);
    checkAuth();
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
