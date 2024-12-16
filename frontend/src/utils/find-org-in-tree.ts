import { OrgTree } from '@data-contracts/backend/data-contracts';

export const findOrgInTree = (orgTrees: OrgTree[], orgNumber: number): OrgTree | null => {
  return orgTrees.reduce((foundOrg: OrgTree | null, org) => {
    if (org.orgId === orgNumber) {
      return org;
    }
    if (org?.organizations && org.organizations.length > 0) {
      const childOrg = findOrgInTree(org.organizations, orgNumber);
      if (childOrg) {
        return childOrg;
      }
    }
    return foundOrg;
  }, null);
};
