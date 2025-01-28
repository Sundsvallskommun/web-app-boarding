export interface ClientUser {
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  permissions: Permissions;
  role: InternalRole;
  organizationId: number;
  children: number[];
}
export interface Permissions {
  canEditAdmin: boolean;
  canViewAdmin: boolean;
  canEditDepartment: boolean;
  canViewDepartment: boolean;
  isManager: boolean;
}

/** Internal roles */
export type InternalRole = 'global_admin' | 'department_admin' | 'developer' | 'user';
export enum InternalRoleEnum {
  global_admin = 'global_admin',
  department_admin = 'department_admin',
  developer = 'developer',
  user = 'user',
}

export type InternalRoleMap = Map<InternalRole, Partial<Permissions>>;
