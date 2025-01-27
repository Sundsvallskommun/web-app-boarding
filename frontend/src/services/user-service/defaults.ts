import { User } from '@data-contracts/backend/data-contracts';
import { ApiResponse } from '@services/api-service';
import { Permissions } from '@data-contracts/backend/data-contracts';

export const defaultPermissions: Permissions = {
  canEditAdmin: false,
  canViewAdmin: false,
  canEditDepartment: false,
  canViewDepartment: false,
  isManager: false,
};

export const emptyUser: User = {
  name: '',
  firstName: '',
  lastName: '',
  username: '',
  role: 'user',
  permissions: defaultPermissions,
  organizationId: -1,
  children: [],
};

export const emptyUserResponse: ApiResponse<User> = {
  data: emptyUser,
  message: 'none',
};
