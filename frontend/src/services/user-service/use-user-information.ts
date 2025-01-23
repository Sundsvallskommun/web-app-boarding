import { useCrudHelper } from '@utils/use-crud-helpers';
import { userInformationStore } from '@services/user-service/use-user-information-store';
import { getUser } from '@services/user-service/user-service';
import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';

export const useUserInformation = (
  username: string
): {
  data: { username: string; name: string }[] | null;
  loaded: boolean;
  loading: boolean;
  refresh: (username: string) => void;
} => {
  const { handleGetOne } = useCrudHelper('user');
  const [data, setData] = userInformationStore(useShallow((state) => [state.data, state.setData]));
  const [loaded, setLoaded, loading, setLoading, id, setId] = userInformationStore((state) => [
    state.loaded,
    state.setLoaded,
    state.loading,
    state.setLoading,
    state.id,
    state.setId,
  ]);

  const refresh = (_username: string) => {
    setLoading(true);
    handleGetOne(() => getUser(_username))
      .then((res) => {
        if (res && _username && res.data) {
          const newUser = { username: _username, name: res.data.givenname + ' ' + res.data.lastname };
          const newData = [...data, newUser];
          setData(newData);
          setLoaded(true);
          setLoading(false);
        }
      })
      .catch(() => {
        setData([]);
        setLoaded(false);
        setLoading(false);
      });
  };

  const handleRefresh = () => {
    refresh(id);
  };

  useEffect(() => {
    if (data.every((userInfo) => userInfo.username !== username)) {
      setLoaded(false);
      setId(username);
      refresh(username);
    }
  }, [username]);

  return { data, loaded, loading, refresh: handleRefresh };
};
