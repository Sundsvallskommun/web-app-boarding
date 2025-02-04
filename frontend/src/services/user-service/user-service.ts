import { ApiResponse, apiService } from '../api-service';
import { createWithEqualityFn } from 'zustand/traditional';
import { devtools } from 'zustand/middleware';
import { __DEV__ } from '@sk-web-gui/react';
import { emptyUser } from './defaults';
import { ServiceResponse } from '@interfaces/services';
import { Employee, User } from '@data-contracts/backend/data-contracts';
import { capitalize } from 'underscore.string';

const handleSetUserResponse: (res: ApiResponse<User>) => User = (res) => ({
  name: res.data.name,
  firstName: res.data.firstName,
  lastName: res.data.lastName,
  username: res.data.username,
  role: res.data.role,
  permissions: res.data.permissions,
  organizationId: res.data.organizationId,
  children: res.data.children,
});

const getMe: () => Promise<ServiceResponse<User>> = () => {
  return apiService
    .get<ApiResponse<User>>('me')
    .then((res) => ({ data: handleSetUserResponse(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const getUser: (username: string) => Promise<ServiceResponse<Employee>> = (username) => {
  return apiService
    .get<ApiResponse<Employee>>(`portalpersondata/personal/${username}`)
    .then((res) => res.data)
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

export const isAdmin = (user: User) => user.role === 'global_admin' || user.role === 'department_admin';

interface State {
  user: User;
}
interface Actions {
  setUser: (user: User) => void;
  getMe: () => Promise<ServiceResponse<User>>;
  reset: () => void;
}

const initialState: State = {
  user: emptyUser,
};

export const useUserStore = createWithEqualityFn<State & Actions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      setUser: (user) => set(() => ({ user })),
      getMe: async () => {
        let user = get().user;
        const res = await getMe();
        if (!res.error && res.data) {
          user = res.data;
          set(() => ({ user: user }));
        }
        return { data: user };
      },
      reset: () => {
        set(initialState);
      },
    }),
    { enabled: __DEV__ }
  )
);

export const getMentorInitials = (name: string) => {
  return capitalize(name[0]) + capitalize(name.split(' ')[1][0]);
};
