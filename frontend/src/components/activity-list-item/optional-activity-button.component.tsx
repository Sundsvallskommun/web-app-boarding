import React from 'react';
import { useTranslation } from 'next-i18next';
import { Button } from '@sk-web-gui/react';
import { Ban, Goal } from 'lucide-react';

export interface OptionalActivityButtonProps {
  fulfilmentStatus: 'EMPTY' | 'TRUE' | 'FALSE' | 'NOT_RELEVANT';
  updateTaskFulfilment: (newFulfilmentStatus: 'EMPTY' | 'TRUE' | 'FALSE' | 'NOT_RELEVANT') => void;
}

export const OptionalActivityButton: React.FC<OptionalActivityButtonProps> = (props) => {
  const { t } = useTranslation();
  const { fulfilmentStatus, updateTaskFulfilment } = props;
  const relevance = fulfilmentStatus === 'NOT_RELEVANT' ? t('task:mark_as_relevant') : t('task:mark_as_not_relevant');
  const icon = fulfilmentStatus === 'NOT_RELEVANT' ? <Goal /> : <Ban />;

  const updateRelevance = () => {
    updateTaskFulfilment(fulfilmentStatus === 'NOT_RELEVANT' ? 'EMPTY' : 'NOT_RELEVANT');
  };

  return (
    <Button
      onClick={() => updateRelevance()}
      data-cy="optional-activity-button"
      className="mt-16"
      variant="secondary"
      size="sm"
      leftIcon={icon}
    >
      {relevance}
    </Button>
  );
};
