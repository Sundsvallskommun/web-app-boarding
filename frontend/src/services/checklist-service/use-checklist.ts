import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';
import { useCrudHelper } from '@utils/use-crud-helpers';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { getChecklistAsEmployee } from './checklist-service';
import { useChecklistStore } from './use-checklist-store';

export const useChecklist = (
  username?: string
): {
  data: EmployeeChecklist | null;
  loaded: boolean;
  loading: boolean;
  refresh: () => void;
} => {
  const { handleGetOne } = useCrudHelper('checklists');
  const [data, setData, loaded, setLoaded, loading, setLoading, id, setId] = useChecklistStore(
    useShallow((state) => [
      state.data,
      state.setData,
      state.loaded,
      state.setLoaded,
      state.loading,
      state.setLoading,
      state.id,
      state.setId,
    ])
  );

  const refresh = (_username: string) => {
    if (_username) {
      setLoading(true);
      handleGetOne(() => getChecklistAsEmployee(_username))
        .then((res) => {
          if (res) {
            setData(res);
          }
          setLoaded(true);
          setLoading(false);
        })
        .catch(() => {
          setData(null);
          setLoaded(false);
          setLoading(false);
        });
    }
  };

  const handleRefresh = () => {
    refresh(id);
  };

  useEffect(() => {
    if (username && username !== id) {
      setLoaded(false);
      setId(username);
      refresh(username);
    }
  }, [username]);

  return { data, loaded, loading, refresh: handleRefresh };
};
