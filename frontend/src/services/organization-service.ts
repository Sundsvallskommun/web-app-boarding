import {
  Organization,
  OrganizationCreateRequest,
  OrgTemplate,
  OrgTemplateApiResponse,
  OrgTree,
  OrgTreeApiResponse,
} from '@data-contracts/backend/data-contracts';
import { findOrgInTree } from '@utils/find-org-in-tree';
import { useEffect, useMemo } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { ApiResponse, apiService } from './api-service';

const getOrgTree = (orgId: number) => {
  return apiService.get<OrgTreeApiResponse>(`/org/${orgId}/tree`).then((res) => {
    if (res) {
      return res.data.data;
    }
  });
};

export const getOrganization = (orgId: number) => {
  return apiService.get<ApiResponse<Organization[]>>(`/org/${orgId}`).then((res) => {
    if (res) {
      return res.data.data;
    }
  });
};

export const createOrganization = (orgData: OrganizationCreateRequest) => {
  return apiService.post<ApiResponse<Organization>>('/org', orgData).then((res) => {
    if (res) {
      return res.data.data;
    } else {
      throw new Error('Failed to create organization');
    }
  });
};

const getOrgTemplate = (orgId: number) => {
  return apiService.get<OrgTemplateApiResponse>(`/org/${orgId}/template`).then((res) => {
    if (res) {
      return res.data.data;
    }
  });
};

interface OrgTreeStore {
  data: Record<number, OrgTree>;
  setData: (data: Record<number, OrgTree>) => void;
  loaded: boolean;
  setLoaded: (loaded: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useOrgTreeStore = create(
  persist<OrgTreeStore>(
    (set) => ({
      data: {},
      setData: (data) => set(() => ({ data })),
      loaded: false,
      setLoaded: (loaded) => set(() => ({ loaded })),
      loading: false,
      setLoading: (loading) => set(() => ({ loading })),
    }),
    {
      name: 'OrgTree',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useOrgTree = (organizations?: number[]) => {
  const [data, setData, loaded, setLoaded, loading, setLoading] = useOrgTreeStore(
    useShallow((state) => [state.data, state.setData, state.loaded, state.setLoaded, state.loading, state.setLoading])
  );
  const orgstring = useMemo(() => JSON.stringify(organizations), [organizations]);

  useEffect(() => {
    if (organizations && organizations.length > 0) {
      setLoading(true);
      let newData = data;
      for (let index = 0; index < organizations.length; index++) {
        if (!Object.keys(data).includes(organizations[index].toString())) {
          getOrgTree(organizations[index])
            .then((res) => {
              if (res) {
                newData = { ...newData, [organizations[index]]: res };
                setData(newData);
              }
            })
            .catch((e) => {
              console.log(e);
            });
        }
      }
      setData(newData);
      setLoaded(true);
      setLoading(false);
    }
  }, [orgstring]);

  return { data: Object.values(data), loaded, loading };
};

interface OrgTemplatesStore {
  data: OrgTemplate | undefined;
  setData: (data: OrgTemplate | undefined) => void;
  loaded: boolean;
  setLoaded: (loaded: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const useOrgTemplatesStore = create(
  persist<OrgTemplatesStore>(
    (set) => ({
      data: undefined,
      setData: (data) => set(() => ({ data })),
      loaded: false,
      setLoaded: (loaded) => set(() => ({ loaded })),
      loading: false,
      setLoading: (loading) => set(() => ({ loading })),
    }),
    {
      name: 'OrgTemplates',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export const useOrgTemplates = (orgid: number) => {
  const [data, setData, loaded, setLoaded, loading, setLoading] = useOrgTemplatesStore(
    useShallow((state) => [state.data, state.setData, state.loaded, state.setLoaded, state.loading, state.setLoading])
  );
  const { data: orgTree } = useOrgTree();

  useEffect(() => {
    setData(undefined);
    setLoaded(false);
    setLoading(true);
    getOrgTemplate(orgid)
      .then((res) => {
        if (res) {
          setData(res);
          setLoaded(true);
        }
        setLoading(false);
      })
      .catch(() => {
        const fromOrgTree = findOrgInTree(orgTree, orgid);
        if (fromOrgTree) {
          setData({
            id: fromOrgTree.organizationId,
            organizationName: fromOrgTree.orgName || fromOrgTree.orgDisplayName || '',
            organizationNumber: fromOrgTree.orgId,
            checklists: [],
            communicationChannels: 'NO_COMMUNICATION',
            created: '',
            updated: '',
          });
          setLoaded(true);
        }
        setLoading(false);
      });
  }, [orgid]);

  return { data, loaded, loading };
};
