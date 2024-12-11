import { OrganizationMenu } from '@components/admin/organization-menu/organization-menu.component';
import { MenuIndex } from '@sk-web-gui/menu-vertical/dist/types/menu-vertical-context';
import React from 'react';

export default function AdminSidebar() {
  const [current, setCurrent] = React.useState<MenuIndex>(undefined);

  const handleSetCurrent = (menuIndex: MenuIndex) => {
    setCurrent(menuIndex);
  };

  return (
    <div className="w-[45rem] min-h-full grow p-20 border-r-1 border-divider flex flex-col gap-40">
      <div className="flex flex-col gap-24">
        <OrganizationMenu current={current} setCurrent={() => handleSetCurrent} />
      </div>
    </div>
  );
}
