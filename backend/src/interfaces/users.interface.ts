export interface ClientUser {
  name: string;
  firstName: string;
  lastName: string;
  username: string;
  permissions: Permissions;
  role: InternalRole;
}
export interface Permissions {
  canEditAdmin: boolean;
  canViewAdmin: boolean;
  isManager: boolean;
}

/** Internal roles */
export type InternalRole = 'admin' | 'developer' | 'user';
export enum InternalRoleEnum {
  admin = 'admin',
  developer = 'developer',
  user = 'user',
}

export type InternalRoleMap = Map<InternalRole, Partial<Permissions>>;
