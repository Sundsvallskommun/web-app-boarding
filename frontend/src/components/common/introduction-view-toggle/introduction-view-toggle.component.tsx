import React, { Dispatch, SetStateAction } from 'react';
import { RadioButton } from '@sk-web-gui/react';
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
      <strong>{t('common:show_introduction_of')} </strong>
      <RadioButton.Group inline className="mx-16" data-cy="radio-button-group">
        <RadioButton
          checked={currentView === 0}
          value={0}
          onChange={() => setCurrentView(0)}
          data-cy="radio-button-manager-view"
        >
          {t('common:manager')}
        </RadioButton>
        <RadioButton
          checked={currentView === 1}
          value={1}
          onChange={() => setCurrentView(1)}
          data-cy="radio-button-employee-view"
        >
          {t('common:employee')}
        </RadioButton>
      </RadioButton.Group>
    </div>
  );
};
