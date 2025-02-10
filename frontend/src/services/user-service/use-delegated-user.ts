import { useCrudHelper } from '@utils/use-crud-helpers';
import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';
import { getEmployeeByEmail } from '@services/checklist-service/checklist-service';
import { delegatedUsersStore } from '@services/user-service/use-delegated-user-store';

export const useDelegatedUsers = (
  emails: string[]
): {
  data: { name: string; email: string }[] | null;
  loaded: boolean;
  loading: boolean;
  refresh: (email: string) => void;
} => {
  const { handleGetOne } = useCrudHelper('user');
  const [data, setData] = delegatedUsersStore(useShallow((state) => [state.data, state.setData]));
  const [loaded, setLoaded, loading, setLoading, id, setId] = delegatedUsersStore((state) => [
    state.loaded,
    state.setLoaded,
    state.loading,
    state.setLoading,
    state.id,
    state.setId,
  ]);

  const refresh = (_email: string) => {
    if (!_email) return;
    setLoading(true);

    handleGetOne(() => getEmployeeByEmail(_email))
      .then((res) => {
        if (res && _email) {
          const newUser = { name: res.givenname + ' ' + res.lastname, email: res.email };
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
    emails.filter((email) => {
      if (data.every((user) => user.email !== email)) {
        setLoaded(false);
        setId(email);
        refresh(email);
      }
    });
  }, [emails]);

  return { data, loaded, loading, refresh: handleRefresh };
};
