import {
  OrganizationsApiResponse,
  OrgTemplate,
  OrgTemplateApiResponse,
  OrgTree,
  OrgTreeApiResponse,
} from '@data-contracts/backend/data-contracts';
import { useEffect, useMemo, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';
import { apiService } from './api-service';
import { findOrgInTree } from '@utils/find-org-in-tree';

export const getOrgTree = async (orgId: number) => {
  const res = await apiService.get<OrgTreeApiResponse>(`/org/${orgId}/tree`);
  if (res) {
    return res.data.data;
  }
};

export const getOrgTemplate = async (orgId: number) => {
  const res = await apiService.get<OrgTemplateApiResponse>(`/org/${orgId}/template`);
  if (res) {
    return res.data.data;
  }
};

export const getOrgTemplates = async (orgIds: number[]) => {
  const res = await apiService.post<OrganizationsApiResponse>(`/org/templates/`, orgIds);
  if (res) {
    return res.data.data;
  }
};

export const getParentChain = (orgTree: OrgTree[], orgId: number) => {
  const org = findOrgInTree(orgTree, orgId);
  if (org) {
    const chain = [org];
    let parent = findOrgInTree(orgTree, org.parentId);
    while (parent) {
      chain.unshift(parent);
      parent = findOrgInTree(orgTree, parent.parentId);
    }
    return chain;
  }
  return [];
};

interface OrgTreeStore {
  data: Record<number, OrgTree>;
  setData: (data: Record<number, OrgTree>) => void;
  loaded: boolean;
  setLoaded: (loaded: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const useOrgTreeStore = create(
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

export const useOrgTemplate = (orgid: number) => {
  const [data, setData] = useState<OrgTemplate | null>(null);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const { data: orgTree } = useOrgTree();

  useEffect(() => {
    if (data?.organizationNumber !== orgid) {
      setData(null);
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
    }
  }, [orgid]);

  return { data, loaded, loading };
};
