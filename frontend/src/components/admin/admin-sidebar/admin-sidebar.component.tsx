import { OrganizationMenu } from '@components/admin/organization-menu/organization-menu.component';
import { SearchField } from '@sk-web-gui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

export default function AdminSidebar() {
  const { t } = useTranslation();
  const [value, setValue] = useState<string>('');

  return (
    <div className="max-w-[38rem] min-h-full bg-background-content shadow-100 pt-32 pb-24 px-20 flex flex-col gap-40">
      <nav className="flex flex-col gap-16">
        <h1 className="text-label-medium m-0">{capitalize(t('templates:name_other'))}</h1>

        <SearchField
          data-cy="orgtree-filter"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onReset={() => setValue('')}
          showSearchButton={false}
          placeholder={t('admin:search_orgtree')}
          size="md"
        />

        <OrganizationMenu searchValue={value} />
      </nav>
    </div>
  );
}
