import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';
import { useUserStore } from '@services/user-service/user-service';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { getDelegatedChecklists } from './checklist-service';
import { useDelegatedChecklistStore } from './use-checklist-store';
import { useCrudHelper } from '@utils/use-crud-helpers';

export const useDelegatedChecklists = (): {
  data: EmployeeChecklist[];
  loaded: boolean;
  loading: boolean;
  refresh: () => void;
} => {
  const { permissions, username } = useUserStore(useShallow((state) => state.user));
  const { handleGetMany } = useCrudHelper('checklists');
  const [data, setData, loaded, setLoaded, loading, setLoading] = useDelegatedChecklistStore(
    useShallow((state) => [state.data, state.setData, state.loaded, state.setLoaded, state.loading, state.setLoading])
  );

  const refresh = () => {
    if (username) {
      setLoading(true);
      handleGetMany(() => getDelegatedChecklists(username))
        .then((res) => {
          if (res) {
            setData(res.employeeChecklists);
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
