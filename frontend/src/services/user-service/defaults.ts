import { User } from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';
import { Permissions } from '@interfaces/permissions';

export const defaultPermissions: Permissions = {
  canEditAdmin: false,
  canViewAdmin: false,
};

export const emptyUser: User = {
  name: '',
  firstName: '',
  lastName: '',
  username: '',
  role: 'user',
  permissions: defaultPermissions,
};

export const emptyUserResponse: ApiResponse<User> = {
  data: emptyUser,
  message: 'none',
};
