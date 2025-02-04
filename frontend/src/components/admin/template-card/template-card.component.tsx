import { Template } from '@data-contracts/backend/data-contracts';
import { Card, Label } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

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
            <h3 className="text-h3-sm md:text-h3-md xl:text-h3-lg mb-8">{template.displayName}</h3>
          </Card.Header>
          <Card.Text className="flex flex-col gap-8">
            <ul className="flex flex-col gap-8 text-dark-secondary">
              <li>
                <span>{`${t('templates:properties.updated')}`}</span>
                {` ${dayjs(template.updated).format('D MMM YYYY')}`}
              </li>
            </ul>
          </Card.Text>
        </Card.Body>
        <Card.Meta>asdf</Card.Meta>
      </Card>
    </Link>
  );
};
