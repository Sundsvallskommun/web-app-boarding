import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

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

export const createDelegatedUserStore = (name: string) => {
  return create(
    persist<
      State<{ name: string; email: string }[]> &
        Actions<{ name: string; email: string }[]> & { id: string; setId: (id: string) => void }
    >(
      (set) => ({
        data: [],
        loaded: false,
        loading: false,
        setData: (data) => set(() => ({ data })),
        setLoaded: (loaded) => set(() => ({ loaded })),
        setLoading: (loading) => set(() => ({ loading })),
        id: '',
        setId: (id) => set(() => ({ id })),
      }),
      {
        name,
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  );
};

export const delegatedUsersStore = createDelegatedUserStore('delegatedUsers');
