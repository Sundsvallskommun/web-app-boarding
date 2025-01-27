import { APIS, MUNICIPALITY_ID } from '@/config';
import { ClientUser } from '@/interfaces/users.interface';
import { Checklist } from '@/responses/checklist.response';
import ApiService from './api.service';

const getTemplate = async (templateId: string, user: ClientUser) => {
  const apiService = new ApiService();
  const checklist = APIS.find(api => api.name === 'checklist');
  const url = `${checklist.name}/${checklist.version}/${MUNICIPALITY_ID}/checklists/${templateId}`;
  const res = await apiService.get<Checklist>({ url }, user);
  return res.data;
};
