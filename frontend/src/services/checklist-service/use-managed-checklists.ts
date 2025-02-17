import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';
import { useUserStore } from '@services/user-service/user-service';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { getChecklistsAsManager } from './checklist-service';
import { useManagedChecklistStore } from './use-checklist-store';
import { useCrudHelper } from '@utils/use-crud-helpers';

export const useManagedChecklists = (): {
  data: EmployeeChecklist[];
  loaded: boolean;
  loading: boolean;
  refresh: (managerUsername?: string) => void;
} => {
  const { permissions, username } = useUserStore(useShallow((state) => state.user));
  const { handleGetMany } = useCrudHelper('checklists');
  const [data, setData, loaded, setLoaded, loading, setLoading] = useManagedChecklistStore(
    useShallow((state) => [state.data, state.setData, state.loaded, state.setLoaded, state.loading, state.setLoading])
  );

  const refresh = (managerUsername?: string) => {
    if (managerUsername?.length) {
      setLoading(true);
      handleGetMany(() => getChecklistsAsManager(managerUsername))
        .then((res) => {
          if (res) {
            setData(res);
          }
          setLoaded(true);
          setLoading(false);
        })
        .catch(() => {
          setLoaded(false);
          setLoading(false);
        });
    } else if (permissions.isManager && username) {
      setLoading(true);
      handleGetMany(() => getChecklistsAsManager(username))
        .then((res) => {
          if (res) {
            setData(res);
          }
          setLoaded(true);
          setLoading(false);
        })
        .catch(() => {
          setLoaded(false);
          setLoading(false);
        });
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    if (!loaded || !data) {
      refresh();
    }
  }, [username, permissions.isManager]);

  return { data, loaded, loading, refresh };
};
