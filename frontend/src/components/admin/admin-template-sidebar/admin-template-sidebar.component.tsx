import { Tabs } from '@sk-web-gui/react';
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
    <div className="w-full max-w-[38rem] right-0 ml-40 border-l-1 border-divider gap-16 py-32 px-20 break-words">
      <Tabs current={current} color="tertiary" className="mb-40" data-cy="tab-bar">
        <Tabs.Item>
          <Tabs.Button onClick={() => setCurrent(0)}>{t('templates:related_templates')}</Tabs.Button>
          <Tabs.Content>
            <AdminTemplateSidebarActivities currentView={currentView} />
          </Tabs.Content>
        </Tabs.Item>

        <Tabs.Item>
          <Tabs.Button data-cy="history-button" onClick={() => setCurrent(1)}>
            {t('templates:history')}
          </Tabs.Button>
          <Tabs.Content>
            <AdminTemplateSidebarHistory />
          </Tabs.Content>
        </Tabs.Item>
      </Tabs>
    </div>
  );
};
