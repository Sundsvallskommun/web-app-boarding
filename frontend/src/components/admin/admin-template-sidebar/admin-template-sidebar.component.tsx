import { Button, MenuBar } from '@sk-web-gui/react';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AdminTemplateSidebarActivities } from '@components/admin/admin-template-sidebar/admin-template-sidebar-activities/admin-template-sidebar-activities.component';
import { AdminTemplateSidebarHistory } from '@components/admin/admin-template-sidebar/admin-template-sidebar-history/admin-template-sidebar-history.component';

interface AdminTemplateSidebarProps {
  currentView: number;
}

export const AdminTemplateSidebar: React.FC<AdminTemplateSidebarProps> = (props) => {
  const { currentView } = props;
  const [current, setCurrent] = useState<number>(0);
  const { t } = useTranslation();

  return (
    <div className="w-full max-w-[43rem] right-0 ml-40 border-l-1 border-divider gap-16 py-32 px-20 break-words">
      <MenuBar current={current} color="tertiary" className="mb-40" showBackground>
        <MenuBar.Item className="w-full">
          <Button className="w-full" onClick={() => setCurrent(0)}>
            {t('templates:higher_level_activities')}
          </Button>
        </MenuBar.Item>
        <MenuBar.Item className="w-full">
          <Button data-cy="history-button" className="w-full" onClick={() => setCurrent(1)}>
            {t('templates:history')}
          </Button>
        </MenuBar.Item>
      </MenuBar>

      <div>
        {current === 0 ?
          <AdminTemplateSidebarActivities currentView={currentView} />
        : <AdminTemplateSidebarHistory />}
      </div>
    </div>
  );
};
