import { OngoingEmployeeChecklist, PagingMetaData } from '@data-contracts/backend/data-contracts';
import { useUserStore } from '@services/user-service/user-service';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { getAllOngoingChecklists } from './checklist-service';
import { useOngoingChecklistStore } from './use-checklist-store';
import { useCrudHelper } from '@utils/use-crud-helpers';

export const useOngoingChecklists = (
  currentPage: number,
  _pageSize: number,
  sortBy: string,
  sortDirection: string
): {
  data: {
    checklists: OngoingEmployeeChecklist[];
    _meta: PagingMetaData;
  };
  loaded: boolean;
  loading: boolean;
  refresh: (query: string) => void;
} => {
  const { permissions, username } = useUserStore(useShallow((state) => state.user));
  const { handleGetMany } = useCrudHelper('checklists');
  const [data, setData, loaded, setLoaded, loading, setLoading] = useOngoingChecklistStore(
    useShallow((state) => [state.data, state.setData, state.loaded, state.setLoaded, state.loading, state.setLoading])
  );

  const refresh = (query: string = '') => {
    if ((permissions.canViewAdmin || permissions.canViewDepartment) && username) {
      setLoading(true);
      handleGetMany(() => getAllOngoingChecklists(currentPage, _pageSize, sortBy, sortDirection, query))
        .then((res) => {
          if (res) {
            setData({
              checklists: res.checklists,
              _meta: res._meta,
            });
          }
          setLoaded(true);
          setLoading(false);
        })
        .catch(() => {
          setLoaded(false);
          setLoading(false);
        });
    } else {
      setData({
        checklists: [],
        _meta: {
          page: 0,
          limit: 15,
          count: 0,
          totalRecords: 0,
          totalPages: 0,
        },
      });
    }
  };

  useEffect(() => {
    if (!loaded || !data) {
      refresh('');
    }
  }, [username, permissions.canViewAdmin]);

  return { data, loaded, loading, refresh };
};
