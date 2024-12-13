import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';
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

export const useManagedChecklistStore = createEmployeeChecklistStore();
export const useDelegatedChecklistStore = createEmployeeChecklistStore();

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
