import { APIS, MUNICIPALITY_ID } from '@/config';
import { OrganizationTree } from '@/data-contracts/mdviewer/data-contracts';
import { ClientUser } from '@/interfaces/users.interface';
import { OrganizationApiResponse } from '@/responses/organization.response';
import ApiService from './api.service';

export const getOrgChildren = async (orgId: number, user): Promise<number[]> => {
  const apiService = new ApiService();
  const mdviewer = APIS.find(api => api.name === 'mdviewer');
  const data = await apiService.get<OrganizationTree>({ url: `${mdviewer.name}/${mdviewer.version}/${orgId}/orgtree` }, user);
  const org = data.data;
  let children = [];
  if (org) {
    children = traverseOrgTree(org, children);
  }
  return children;
};

const traverseOrgTree = (orgTree: OrganizationTree, children: number[]) => {
  children.push(orgTree.orgId);
  if (orgTree.organizations) {
    orgTree.organizations.forEach(child => {
      traverseOrgTree(child, children);
    });
  }
  return children;
};

export const getOrganization = async (orgId: number, user: ClientUser) => {
  const apiService = new ApiService();
  const checklist = APIS.find(api => api.name === 'checklist');
  const data = await apiService.get<OrganizationApiResponse>(
    {
      url: `${checklist.name}/${checklist.version}/${MUNICIPALITY_ID}/organizations`,
      params: {
        organizationFilter: orgId,
      },
    },
    user,
  );
  if (data?.data?.[0]) {
    return data.data[0];
  } else {
    return undefined;
  }
};
