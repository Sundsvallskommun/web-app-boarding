import { EmployeeChecklist } from '@data-contracts/backend/data-contracts';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface State {
  data: EmployeeChecklist[];
  loaded: boolean;
  loading: boolean;
}

interface Actions {
  setData: (data: EmployeeChecklist[]) => void;
  setLoaded: (loaded: boolean) => void;
  setLoading: (loading: boolean) => void;
}

const createEmployeeChecklistStore = (name: string) => {
  return create(
    persist<State & Actions>(
      (set) => ({
        data: [],
        loaded: false,
        loading: false,
        setData: (data) => set(() => ({ data })),
        setLoaded: (loaded) => set(() => ({ loaded })),
        setLoading: (loading) => set(() => ({ loading })),
      }),
      {
        name,
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  );
};

export const useManagedChecklistStore = createEmployeeChecklistStore('ManagedChecklists');
export const useDelegatedChecklistStore = createEmployeeChecklistStore('DelegatedChecklists');
