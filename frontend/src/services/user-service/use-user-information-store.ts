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

export const createUserInformationStore = (name: string) => {
  return create(
    persist<
      State<{ username: string; name: string }[]> &
        Actions<{ username: string; name: string }[]> & { id: string; setId: (id: string) => void }
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

export const userInformationStore = createUserInformationStore('userInformation');
