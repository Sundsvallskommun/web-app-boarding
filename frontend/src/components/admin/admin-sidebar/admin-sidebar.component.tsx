import { OrganizationMenu } from '@components/admin/organization-menu/organization-menu.component';
import { MenuIndex } from '@sk-web-gui/menu-vertical/dist/types/menu-vertical-context';
import { Avatar, Logo, MenuVertical } from '@sk-web-gui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

export default function AdminSidebar() {
  const [current, setCurrent] = React.useState<MenuIndex>('test');

  const handleSetCurrent = (menuIndex: MenuIndex) => {
    setCurrent(menuIndex);
  };

  const { t } = useTranslation();

  return (
    <div className="w-[45rem] min-h-full grow bg-background-content shadow-100 p-20 flex flex-col gap-40">
      <Logo variant="service" title={t('common:title')} subtitle={capitalize(t('common:admin'))} className="mt-24" />
      <Avatar />
      <div className="flex flex-col gap-24">
        <MenuVertical.Provider current={current} setCurrent={() => handleSetCurrent}>
          <MenuVertical.Nav>
            <MenuVertical.Label className="mb-16">{t('admin:menu.introductions')}</MenuVertical.Label>
            <MenuVertical>
              <MenuVertical.Item menuIndex="test">
                <a href="#">
                  <span className="h-52 flex items-center">{t('admin:menu.ongoing')}</span>
                </a>
              </MenuVertical.Item>
              <MenuVertical.Item menuIndex="done">
                <a href="#">
                  <span className="h-52 flex items-center">{t('admin:menu.done')}</span>
                </a>
              </MenuVertical.Item>
            </MenuVertical>
          </MenuVertical.Nav>
        </MenuVertical.Provider>

        <OrganizationMenu current={current} setCurrent={() => handleSetCurrent} />
      </div>
    </div>
  );
}
