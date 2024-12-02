import { InternalRole, Permissions } from '@interfaces/users.interface';
import { roleADMapping } from './ad-role.service';

export const defaultPermissions: () => Permissions = () => ({
  canEditAdmin: false,
  canViewAdmin: false,
  isManager: false,
});

enum RoleOrderEnum {
  'admin',
  'developer',
  'user',
}

const roles = new Map<InternalRole, Partial<Permissions>>([
  [
    'admin',
    {
      canEditAdmin: true,
      canViewAdmin: true,
    },
  ],
  [
    'developer',
    {
      canEditAdmin: true,
      canViewAdmin: true,
    },
  ],
  [
    'user',
    {
      canEditAdmin: false,
      canViewAdmin: false,
    },
  ],
]);

/**
 *
 * @param groups Array of groups/roles
 * @param internalGroups Whether to use internal groups or external group-mappings
 * @returns collected permissions for all matching role groups
 */
export const getPermissions = (groups: InternalRole[] | string[], internalGroups = false): Permissions => {
  const permissions: Permissions = defaultPermissions();
  groups.forEach(group => {
    const groupLower = group.toLowerCase();
    const role = internalGroups ? (groupLower as InternalRole) : (roleADMapping[groupLower] as InternalRole);
    if (roles.has(role)) {
      const groupPermissions = roles.get(role);
      Object.keys(groupPermissions).forEach(permission => {
        if (groupPermissions[permission] === true) {
          permissions[permission] = true;
        }
      });
    }
  });
  return permissions;
};

/**
 * Ensures to return only the role with most permissions
 * @param groups List of AD roles
 * @returns role with most permissions
 */
export const getRole = (groups: string[]) => {
  if (groups.length == 1) return roleADMapping[groups[0]];

  const roles: InternalRole[] = [];
  groups.forEach(group => {
    const groupLower = group.toLowerCase();
    const role = roleADMapping[groupLower];
    if (role) {
      roles.push(role);
    }
  });

  return roles.sort((a, b) => RoleOrderEnum[a] - RoleOrderEnum[b])[0];
};
