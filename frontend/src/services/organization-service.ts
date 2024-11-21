import { OrgTree, OrgTreeApiResponse } from '@data-contracts/backend/data-contracts';
import { apiService } from './api-service';
import { useEffect, useMemo, useState } from 'react';

const getOrgTree = (orgId: number) => {
  return apiService.get<OrgTreeApiResponse>(`/org/${orgId}/tree`).then((res) => {
    if (res) {
      return res.data.data;
    }
  });
};

export const useOrgTree = (organizations: number[]) => {
  const [data, setData] = useState<Record<number, OrgTree>>({});
  const [loaded, setLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const orgstring = useMemo(() => JSON.stringify(organizations), [organizations]);

  useEffect(() => {
    setLoading(true);
    for (let index = 0; index < organizations.length; index++) {
      getOrgTree(organizations[index])
        .then((res) => {
          setData((oldTree) => ({ ...oldTree, [organizations[index]]: res }));
        })
        .catch((e) => {
          console.log(e);
        });
    }
    setLoading(false);
    setLoaded(true);
  }, [orgstring]);

  return { data: Object.values(data), loaded, loading };
};
