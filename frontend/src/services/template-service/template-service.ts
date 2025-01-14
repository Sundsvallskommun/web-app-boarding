import {
  Checklist,
  ChecklistApiResponse,
  ChecklistCreateRequest,
  OrganizationCreateRequest,
  OrgTree,
  SortorderRequest,
  Task,
  TaskCreateRequest,
  TaskUpdateRequest,
  User,
} from '@data-contracts/backend/data-contracts';
import { ApiResponse, apiService } from '@services/api-service';
import { createOrganization, getOrganization } from '@services/organization-service';
import { findOrgInTree } from '@utils/find-org-in-tree';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { useTemplateStore } from './use-template-store';

const getTemplate: (id: string) => Promise<Checklist | undefined> = (id) => {
  return apiService.get<ChecklistApiResponse>(`/templates/${id}`).then((res) => {
    if (res) {
      return res.data.data;
    }
  });
};

export const setSortorder: (orgId: string, sortOrderData: SortorderRequest) => Promise<SortorderRequest> = async (
  orgId,
  sortOrderData
) => {
  return apiService
    .put<SortorderRequest>(`/templates/sortorder/${orgId}`, sortOrderData)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      console.error('Something went wrong when updating sort order.');
      throw e;
    });
};

export const createTask: (templateId: string, phaseId: string, taskData: TaskCreateRequest) => Promise<Task> = async (
  templateId: string,
  phaseId: string,
  taskData: TaskCreateRequest
) => {
  const taskCreateRequest: TaskCreateRequest = {
    heading: taskData.heading,
    headingReference: taskData.headingReference,
    text: taskData.text,
    sortOrder: taskData.sortOrder,
    roleType: taskData.roleType,
    permission: taskData.permission,
    questionType: taskData.questionType,
    createdBy: taskData.createdBy,
  };

  return apiService
    .post<ApiResponse<Task>>(`/templates/${templateId}/phases/${phaseId}/tasks`, taskCreateRequest)
    .then((response) => {
      return response.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when updating custom task.');
      throw e;
    });
};

export const updateTask: (
  templateId: string,
  phaseId: string,
  taskId: string,
  taskData: TaskUpdateRequest
) => Promise<Task> = async (templateId: string, phaseId: string, taskId: string, taskData: TaskUpdateRequest) => {
  const taskUpdateRequest: TaskUpdateRequest = {
    heading: taskData.heading,
    headingReference: taskData.headingReference,
    text: taskData.text,
    sortOrder: taskData.sortOrder,
    roleType: taskData.roleType,
    permission: taskData.permission,
    questionType: taskData.questionType,
    updatedBy: taskData.updatedBy,
  };

  return apiService
    .patch<ApiResponse<Task>>(`/templates/${templateId}/phases/${phaseId}/tasks/${taskId}`, taskUpdateRequest)
    .then((response) => {
      return response.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when updating custom task.');
      throw e;
    });
};

export const removeTask: (templateId: string, phaseId: string, taskId: string) => Promise<{ status: number }> = async (
  templateId: string,
  phaseId: string,
  taskId: string
) => {
  return apiService
    .delete<{ status: number }>(`/templates/${templateId}/phases/${phaseId}/tasks/${taskId}`)
    .then((response) => {
      return { status: response.status };
    })
    .catch((e) => {
      console.error('Something went wrong when removing a custom task.');
      throw e;
    });
};

export const createTemplate: (
  orgId: string,
  orgTree: Record<number, OrgTree>,
  user: User
) => Promise<Checklist | undefined> = async (orgId, orgTree, user) => {
  if (!orgId) {
    throw new Error('No organization id provided');
  }
  let orgName = '';

  // Check if organization already exists in checklist API.
  // If not, create it.
  const organization = await getOrganization(parseInt(orgId, 10));
  if (organization?.length === 1) {
    orgName = organization[0].organizationName;
  } else {
    const fromOrgTree = findOrgInTree(Object.values(orgTree), parseInt(orgId, 10));
    if (!fromOrgTree) {
      throw new Error('No organization found in tree');
    }
    const data: OrganizationCreateRequest = {
      organizationName: fromOrgTree.orgName || fromOrgTree.orgId.toString(),
      organizationNumber: fromOrgTree.orgId,
      communicationChannels: ['EMAIL'],
    };
    const newOrganization = await createOrganization(data);
    orgName = newOrganization.organizationName;
  }

  const templateData: ChecklistCreateRequest = {
    name: `CHECKLIST_TEMPLATE_${orgName.replace(/\s/g, '_').toUpperCase()}`,
    displayName: `Grund för checklista för ${orgName}`,
    organizationNumber: parseInt(orgId, 10),
    createdBy: user.username,
  };
  return apiService.post<ApiResponse<Checklist>>(`/templates`, templateData).then((response) => response.data.data);
};

export const activateTemplate: (templateId: string) => Promise<Checklist | undefined> = async (templateId: string) => {
  return apiService
    .patch<Checklist>(`/templates/${templateId}/activate`, {})
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      console.error('Something went wrong when removing a custom task.');
      throw e;
    });
};

export const createNewVersion: (templateId: string) => Promise<Checklist | undefined> = async (templateId: string) => {
  return apiService
    .post<ApiResponse<Checklist>>(`/templates/${templateId}/version`, {})
    .then((response) => {
      console.log('response for new version:', response);
      return response.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when removing a custom task.');
      throw e;
    });
};

export const useTemplate = (templateid: string) => {
  const [data, setData] = useTemplateStore(useShallow((state) => [state.data, state.setData]));
  const [loaded, setLoaded, loading, setLoading, id, setId] = useTemplateStore((state) => [
    state.loaded,
    state.setLoaded,
    state.loading,
    state.setLoading,
    state.id,
    state.setId,
  ]);

  const refresh = (templateid: string) => {
    if (templateid) {
      setData(null);
      setLoaded(false);
      setLoading(true);
      getTemplate(templateid)
        .then((res) => {
          if (res) {
            setData(res);
            setLoaded(true);
            setLoading(false);
          }
        })
        .catch(() => {
          setData(null);
          setLoaded(true);
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (data?.id !== templateid) {
      refresh(templateid);
    }
  }, [templateid]);

  return { data, setData, refresh, loaded, loading };
};
