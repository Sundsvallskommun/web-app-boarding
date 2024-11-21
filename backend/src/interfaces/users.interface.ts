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
}

/** Internal roles */
export type InternalRole = 'admin' | 'developer' | 'user';
export enum InternalRoleEnum {
  'admin',
  'developer',
  'user',
}

export type InternalRoleMap = Map<InternalRole, Partial<Permissions>>;
