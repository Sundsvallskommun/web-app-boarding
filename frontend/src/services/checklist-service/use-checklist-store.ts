import { EmployeeChecklist, COngoingEmployeeChecklists } from '@data-contracts/backend/data-contracts';
import { create } from 'zustand';

interface State<T> {
  data: T;
  loaded: boolean;
  loading: boolean;
}

interface Actions<T> {
  setData: (data: T) => void;
  setLoaded: (loaded: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const createEmployeeChecklistStore = () => {
  return create<State<EmployeeChecklist[]> & Actions<EmployeeChecklist[]>>((set) => ({
    data: [],
    loaded: false,
    loading: false,
    setData: (data) => set(() => ({ data })),
    setLoaded: (loaded) => set(() => ({ loaded })),
    setLoading: (loading) => set(() => ({ loading })),
  }));
};

const createOngoingChecklistStore = () => {
  return create<State<COngoingEmployeeChecklists> & Actions<COngoingEmployeeChecklists>>((set) => ({
    data: {
      checklists: [],
      _meta: {
        page: 0,
        limit: 12,
        count: 0,
        totalRecords: 0,
        totalPages: 0,
      },
    },
    loaded: false,
    loading: false,
    setData: (data) => set(() => ({ data })),
    setLoaded: (loaded) => set(() => ({ loaded })),
    setLoading: (loading) => set(() => ({ loading })),
  }));
};

export const useManagedChecklistStore = createEmployeeChecklistStore();
export const useDelegatedChecklistStore = createEmployeeChecklistStore();
export const useOngoingChecklistStore = createOngoingChecklistStore();

export const useChecklistStore = create<
  State<EmployeeChecklist | null> & Actions<EmployeeChecklist | null> & { id: string; setId: (id: string) => void }
>((set) => ({
  data: null,
  loaded: false,
  loading: false,
  setData: (data) => set(() => ({ data })),
  setLoaded: (loaded) => set(() => ({ loaded })),
  setLoading: (loading) => set(() => ({ loading })),
  id: '',
  setId: (id) => set(() => ({ id })),
}));
