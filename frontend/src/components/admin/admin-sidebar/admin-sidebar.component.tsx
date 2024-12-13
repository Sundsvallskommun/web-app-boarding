import { OrganizationMenu } from '@components/admin/organization-menu/organization-menu.component';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

export default function AdminSidebar() {
  const { t } = useTranslation();

  return (
    <div className="w-[45rem] min-h-full bg-background-content shadow-100 pt-32 pb-24 px-20 flex flex-col gap-40">
      <nav className="flex flex-col gap-16">
        <h1 className="text-label-medium m-0">{capitalize(t('templates:name_other'))}</h1>
        <OrganizationMenu />
      </nav>
    </div>
  );
}
