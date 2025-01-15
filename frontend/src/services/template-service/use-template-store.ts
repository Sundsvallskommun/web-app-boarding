import { Checklist } from '@data-contracts/backend/data-contracts';
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

export const useTemplateStore = create<
  State<Checklist | null> & Actions<Checklist | null> & { id: string; setId: (id: string) => void }
>((set) => ({
  data: null,
  loaded: false,
  loading: true,
  setData: (data) => set(() => ({ data })),
  setLoaded: (loaded) => set(() => ({ loaded })),
  setLoading: (loading) => set(() => ({ loading })),
  id: '',
  setId: (id) => set(() => ({ id })),
}));
