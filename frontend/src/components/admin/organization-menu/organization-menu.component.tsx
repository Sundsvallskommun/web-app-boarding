import { OrgTree } from '@data-contracts/backend/data-contracts';
import { useOrgTree } from '@services/organization-service';
import { MenuIndex } from '@sk-web-gui/menu-vertical/dist/types/menu-vertical-context';
import { MenuVertical } from '@sk-web-gui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface OrganizationMenuProps {}

export const OrganizationMenu: React.FC<OrganizationMenuProps> = () => {
  const [current, setCurrent] = useState<MenuIndex>();
  const { data, loaded } = useOrgTree([2669, 2725, 13]);
  const router = useRouter();

  useEffect(() => {
    console.log(router.query);
    if (router?.query?.orgid) {
      setCurrent(parseInt(router.query.orgid as string, 10));
    }
  }, [router]);

  const renderChildren = (organizations: OrgTree[]) => {
    return organizations.map((org) => (
      <MenuVertical.Item key={org.orgId} menuIndex={org.orgId}>
        {org.organizations && org.organizations?.length > 0 ?
          <MenuVertical>
            <MenuVertical.SubmenuButton>
              <Link href={`/admin/templates/${org.orgId}`}>{org.orgDisplayName}</Link>
            </MenuVertical.SubmenuButton>
            {renderChildren(org.organizations)}
          </MenuVertical>
        : <Link href={`/admin/templates/${org.orgId}`}>{org.orgDisplayName}</Link>}
      </MenuVertical.Item>
    ));
  };

  return (
    data?.length > 2 &&
    loaded && (
      <MenuVertical.Provider current={current} setCurrent={setCurrent}>
        <MenuVertical.Sidebar>
          <MenuVertical className="!pr-0 !pl-0">{renderChildren(data)}</MenuVertical>
        </MenuVertical.Sidebar>
      </MenuVertical.Provider>
    )
  );
};
