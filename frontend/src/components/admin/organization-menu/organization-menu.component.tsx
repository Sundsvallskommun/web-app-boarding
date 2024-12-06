import { OrgTree } from '@data-contracts/backend/data-contracts';
import { useOrgTree } from '@services/organization-service';
import { MenuVertical } from '@sk-web-gui/react';
import { useTranslation } from 'react-i18next';
import { MenuIndex } from '@sk-web-gui/menu-vertical/dist/types/menu-vertical-context';
import { Dispatch, SetStateAction } from 'react';

interface OrganizationMenuProps {
  current?: MenuIndex;
  setCurrent?: Dispatch<SetStateAction<MenuIndex>>;
}

export const OrganizationMenu: React.FC<OrganizationMenuProps> = ({ current, setCurrent }) => {
  const { data, loaded } = useOrgTree([2669, 2725, 13]);

  const { t } = useTranslation();

  const renderChildren = (organizations: OrgTree[]) => {
    return organizations.map((org) => (
      <MenuVertical.Item key={org.orgId} menuIndex={org.orgId}>
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
    data?.length > 2 &&
    loaded && (
      <MenuVertical.Provider current={current} setCurrent={setCurrent}>
        <MenuVertical.Sidebar>
          <MenuVertical.Label>{t('admin:menu.orgtree')}</MenuVertical.Label>
          <MenuVertical className="!pr-0 !pl-0">{renderChildren(data)}</MenuVertical>
        </MenuVertical.Sidebar>
      </MenuVertical.Provider>
    )
  );
};
