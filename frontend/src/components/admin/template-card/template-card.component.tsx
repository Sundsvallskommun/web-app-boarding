import { Template } from '@data-contracts/backend/data-contracts';
import { Card, Label } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import React from 'react';

interface TemplateCardProps {
  template: Template;
  orgId: string;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({ template, orgId }) => {
  const { t } = useTranslation();

  return (
    <Link href={`/admin/templates/${orgId}/${template.id}`} passHref legacyBehavior>
      <Card
        layout="horizontal"
        href={`/admin/templates/edit/${template.id}`}
        useHoverEffect
        className="max-w-[31.2em]"
        data-cy={`template-card-${template.id}`}
      >
        <Card.Body>
          <Card.Header>
            <h3 className="text-h3-sm md:text-h3-md xl:text-h3-lg mb-12">{template.displayName}</h3>
          </Card.Header>
          <Card.Text className="flex flex-col">
            <ul className="flex text-dark-secondary">
              <li>
                <Label
                  className="mr-md"
                  color={
                    template?.lifeCycle === 'ACTIVE' ? 'gronsta'
                    : template?.lifeCycle === 'CREATED' ?
                      'tertiary'
                    : ''
                  }
                  inverted
                  rounded
                >
                  {template?.lifeCycle === 'ACTIVE' ?
                    t('templates:active')
                  : template?.lifeCycle === 'CREATED' ?
                    t('templates:created')
                  : t('templates:deprecated')}
                </Label>
              </li>
              <li>
                <span className="text-small">
                  {t('templates:properties.updated')} {` ${dayjs(template.updated).format('D MMM YYYY, HH.mm')}`}
                </span>
              </li>
            </ul>
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
};
