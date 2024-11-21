import { OrgTree } from '@data-contracts/backend/data-contracts';
import { useOrgTree } from '@services/organization-service';
import { MenuVertical } from '@sk-web-gui/react';
import { useEffect } from 'react';

export const OrganizationMenu: React.FC = () => {
  const { data, loaded } = useOrgTree([2669, 2725, 13]);

  useEffect(() => {
    console.log('data: ', data);
    console.log('loaded: ', loaded);
  }, [data, loaded]);

  const renderChildren = (organizations: OrgTree[]) => {
    return organizations.map((org) => (
      <MenuVertical.Item key={org.orgId}>
        {org.organizations && org.organizations?.length > 0 ?
          <MenuVertical>
            <MenuVertical.SubmenuButton>
              <a href="#">{org.orgDisplayName}</a>
            </MenuVertical.SubmenuButton>
            {renderChildren(org.organizations)}
          </MenuVertical>
        : <a href="#">{org.orgDisplayName}</a>}
      </MenuVertical.Item>
    ));
  };

  return (
    data &&
    loaded && (
      <MenuVertical.Sidebar className="-mx-24">
        <MenuVertical>{renderChildren(data)}</MenuVertical>
      </MenuVertical.Sidebar>
    )
  );
};
