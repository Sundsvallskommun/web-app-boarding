import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useAppContext } from '@contexts/app.context';
import { useUserStore } from '@services/user-service/user-service';

export default function Index() {
  const { user, setUser } = useAppContext();
  const router = useRouter();

  const loggedInUser = useUserStore((s) => s.user);

  useEffect(() => {
    setUser(loggedInUser);
  }, [user]);

  useEffect(() => {
    router.push('/start');

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <LoaderFullScreen />;
}
