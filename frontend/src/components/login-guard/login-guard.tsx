import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useUserStore } from '@services/user-service/user-service';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const LoginGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const user = useUserStore((s) => s.user);
  const getMe = useUserStore((s) => s.getMe);
  const router = useRouter();
  const { query } = router;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    getMe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!mounted || (!user.name && !router.pathname.includes('/login'))) {
    return <LoaderFullScreen />;
  }

  if (
    user?.username &&
    !user?.permissions?.isManager &&
    query?.userId !== user?.username &&
    user?.role !== 'global_admin' &&
    user?.role !== 'department_admin'
  ) {
    router.push(`/${user.username}`);
  }
  if (router.pathname.startsWith('/admin') && user?.role !== 'global_admin' && user?.role !== 'department_admin') {
    router.push('/');
  }

  return <>{children}</>;
};

export default LoginGuard;
