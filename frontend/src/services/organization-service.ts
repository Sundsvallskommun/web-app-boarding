import {
  Organization,
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

const getOrgTree = (orgId: number) => {
  return apiService.get<OrgTreeApiResponse>(`/org/${orgId}/tree`).then((res) => {
    if (res) {
      return res.data.data;
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
    setLoading(true);
    if (data?.organizationNumber !== orgid) {
      setData(null);
      setLoaded(false);
    }
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
        console.log('🚀 ~ useEffect ~ fromOrgTree:', fromOrgTree);
        console.log(orgTree);
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
