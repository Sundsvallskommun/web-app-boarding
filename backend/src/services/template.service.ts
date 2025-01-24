import { ClientUser } from '@/interfaces/users.interface';
import ApiService from './api.service';
import { APIS, MUNICIPALITY_ID } from '@/config';
import { User } from '@/responses/user.response';
import { Checklist } from '@/responses/checklist.response';
import { getOrganization } from './organization.service';
import { Organization } from '@/data-contracts/checklist/data-contracts';
import { HttpException } from '@/exceptions/HttpException';

const getTemplate = async (templateId: string, user: ClientUser) => {
  const apiService = new ApiService();
  const checklist = APIS.find(api => api.name === 'checklist');
  const url = `${checklist.name}/${checklist.version}/${MUNICIPALITY_ID}/checklists/${templateId}`;
  const res = await apiService.get<Checklist>({ url }, user);
  return res.data;
};

// export const validateTemplateAction: (user: ClientUser, orgId: number, templateId: string) => Promise<void> = async (user, orgId, templateId) => {
//   console.log('Checking permissions for user', user);
//   console.log('Org id', orgId);
//   console.log('Template ID', templateId);
//   const organization: Organization = await getOrganization(orgId, user);
//   const userIsSuperAdmin = user.role === 'global_admin';
//   const templateIsInOrg = organization?.checklists?.find(c => c.id === templateId);
//   const userCanEditOrg = user.children.includes(orgId);
//   const allowed = userIsSuperAdmin || (templateIsInOrg && userCanEditOrg);
//   if (!allowed) {
//     console.log('Forbidden');
//     throw new HttpException(403, 'Missing permissions');
//   }
//   // return allowed;
// };
