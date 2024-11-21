import { InternalRole } from '@/interfaces/users.interface';

export type RoleADMapping = {
  [key: string]: InternalRole;
};

const mapping: RoleADMapping = {};

mapping[process.env.ADMIN_GROUP.toLocaleLowerCase()] = 'admin';
// Will this be needed?
// mapping[process.env.SUPERADMIN_GROUP.toLocaleLowerCase()] = 'superadmin';
mapping[process.env.DEVELOPER_GROUP.toLocaleLowerCase()] = 'developer';

export const roleADMapping: RoleADMapping = mapping;
