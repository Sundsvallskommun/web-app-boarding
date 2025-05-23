import { OrgTree } from '@data-contracts/backend/data-contracts';
import { useOrgTree } from '@services/organization-service';
import { MenuVertical, MenuIndex } from '@sk-web-gui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface OrganizationMenuProps {
  searchValue: string;
}

export const OrganizationMenu: React.FC<OrganizationMenuProps> = ({ searchValue }) => {
  const [current, setCurrent] = useState<MenuIndex>();
  const rootIds = process.env.NEXT_PUBLIC_ROOT_IDS?.split(',').map((id) => parseInt(id, 10)) || [];
  const { data, loading } = useOrgTree(rootIds);
  const router = useRouter();

  useEffect(() => {
    if (router?.query?.orgid) {
      setCurrent(parseInt(router.query.orgid as string, 10));
    }
  }, [router]);

  const filterData = (orgs: OrgTree[]) => {
    let hasMatch = false;
    const data = orgs.reduce((tree: OrgTree[], org: OrgTree) => {
      if (org.organizations && org.organizations.length > 0) {
        const children = filterData(org.organizations);
        if (children.hasMatch) {
          hasMatch = true;
          const newOrg: OrgTree = { ...org, organizations: children.data };
          return [...tree, newOrg];
        }
      }
      if (
        searchValue
          .toLowerCase()
          .split(' ')
          .some((word) => org.orgName?.toLowerCase().includes(word) || org.orgName?.toLowerCase().includes(word))
      ) {
        hasMatch = true;
        return [...tree, { ...org, organizations: [] }];
      }
      return tree;
    }, []);
    return { data, hasMatch };
  };

  const { data: filteredData } = filterData(data);

  const renderChildren = (organizations: OrgTree[]) => {
    return organizations.map((org) => (
      <MenuVertical.Item key={org.orgId} menuIndex={org.orgId}>
        {org.organizations && org.organizations?.length > 0 ?
          <MenuVertical>
            <MenuVertical.SubmenuButton>
              <Link href={`/admin/templates/${org.orgId}`}>{org.orgName}</Link>
            </MenuVertical.SubmenuButton>
            {renderChildren(org.organizations)}
          </MenuVertical>
        : <Link href={`/admin/templates/${org.orgId}`}>{org.orgName}</Link>}
      </MenuVertical.Item>
    ));
  };

  return (
    !loading &&
    data.length > 0 && (
      <MenuVertical.Provider current={current} setCurrent={setCurrent}>
        <MenuVertical.Sidebar>
          <MenuVertical className="!pr-0 !pl-0" data-cy="organization-tree">
            {renderChildren(filteredData)}
          </MenuVertical>
        </MenuVertical.Sidebar>
      </MenuVertical.Provider>
    )
  );
};
