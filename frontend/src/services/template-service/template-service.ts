import {
  Checklist,
  ChecklistApiResponse,
  ChecklistCreateRequest,
  Events,
  OrganizationCreateRequest,
  OrgTree,
  Phase,
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

export const getTemplateHistory: (id: string) => Promise<Events | undefined> = (id) => {
  return apiService.get<ApiResponse<Events>>(`/templates/${id}/events`).then((res) => {
    if (res) {
      return res.data.data;
    }
  });
};

export interface TaskWithOrgId extends Task {
  orgId: string;
}

export interface PhaseWithOrgId extends Phase {
  tasks: TaskWithOrgId[];
}

export interface ChecklistWithOrgId extends Checklist {
  phases: PhaseWithOrgId[];
}

export const setSortorder: (
  orgId: string,
  templateId: string,
  sortOrderData: SortorderRequest
) => Promise<SortorderRequest> = async (orgId, templateId, sortOrderData) => {
  return apiService
    .put<SortorderRequest>(`/org/${orgId}/templates/${templateId}/sortorder`, sortOrderData)
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      console.error('Something went wrong when updating sort order.');
      throw e;
    });
};

export const createTask: (
  orgId: number,
  templateId: string,
  phaseId: string,
  taskData: TaskCreateRequest
) => Promise<Task> = async (orgId, templateId, phaseId, taskData) => {
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
    .post<ApiResponse<Task>>(`/org/${orgId}/templates/${templateId}/phases/${phaseId}/tasks`, taskCreateRequest)
    .then((response) => {
      return response.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when updating custom task.');
      throw e;
    });
};

export const updateTask: (
  orgId: string,
  templateId: string,
  phaseId: string,
  taskId: string,
  taskData: TaskUpdateRequest
) => Promise<Task> = async (orgId, templateId, phaseId, taskId, taskData) => {
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
    .patch<ApiResponse<Task>>(
      `/org/${orgId}/templates/${templateId}/phases/${phaseId}/tasks/${taskId}`,
      taskUpdateRequest
    )
    .then((response) => {
      return response.data.data;
    })
    .catch((e) => {
      console.error('Something went wrong when updating custom task.');
      throw e;
    });
};

export const removeTask: (
  orgId: string,
  templateId: string,
  phaseId: string,
  taskId: string
) => Promise<{ status: number }> = async (orgId, templateId, phaseId, taskId) => {
  return apiService
    .delete<{ status: number }>(`/org/${orgId}/templates/${templateId}/phases/${phaseId}/tasks/${taskId}`)
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
      communicationChannels: ['NO_COMMUNICATION'],
    };
    const newOrganization = await createOrganization(data);
    orgName = newOrganization.organizationName;
  }

  const templateData: ChecklistCreateRequest = {
    name: `CHECKLIST_TEMPLATE_${orgName.replace(/\s/g, '_').toUpperCase()}_${orgId}`,
    displayName: `Mall för ${orgName}`,
    organizationNumber: parseInt(orgId, 10),
    createdBy: user.username,
  };
  return apiService
    .post<ApiResponse<Checklist>>(`/org/${orgId}/templates`, templateData)
    .then((response) => response.data.data);
};

export const activateTemplate: (orgId: string, templateId: string) => Promise<Checklist | undefined> = async (
  orgId,
  templateId
) => {
  return apiService
    .patch<Checklist>(`/org/${orgId}/templates/${templateId}/activate`, {})
    .then((response) => {
      return response.data;
    })
    .catch((e) => {
      console.error('Something went wrong when removing a custom task.');
      throw e;
    });
};

export const createNewVersion: (orgId: string, templateId: string) => Promise<Checklist | undefined> = async (
  orgId,
  templateId
) => {
  return apiService
    .post<ApiResponse<Checklist>>(`/org/${orgId}/templates/${templateId}/version`, {})
    .then((response) => {
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
