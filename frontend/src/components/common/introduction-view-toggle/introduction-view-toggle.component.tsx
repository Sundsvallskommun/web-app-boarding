import React, { Dispatch, SetStateAction } from 'react';
import { Tabs } from '@sk-web-gui/react';
import { useTranslation } from 'react-i18next';

interface IntroductionViewToggleProps {
  currentView: number;
  setCurrentView: Dispatch<SetStateAction<number>>;
}

export const IntroductionViewToggle: React.FC<IntroductionViewToggleProps> = (props) => {
  const { currentView, setCurrentView } = props;
  const { t } = useTranslation();

  return (
    <div className="flex">
      <Tabs data-cy="introduction-for-tabs" current={currentView}>
        <Tabs.Item>
          <Tabs.Button onClick={() => setCurrentView(0)} data-cy="introduction-for-tabs-manager-view">
            {t('task:your_activity')}
          </Tabs.Button>
          <Tabs.Content></Tabs.Content>
        </Tabs.Item>
        <Tabs.Item>
          <Tabs.Button onClick={() => setCurrentView(1)} data-cy="introduction-for-tabs-employee-view">
            {t('task:employee_activity')}
          </Tabs.Button>
          <Tabs.Content></Tabs.Content>
        </Tabs.Item>
      </Tabs>
    </div>
  );
};
