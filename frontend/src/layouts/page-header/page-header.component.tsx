import { AdminMenu } from '@components/admin/admin-menu/admin-menu.component';
import { useUserStore } from '@services/user-service/user-service';
import { Divider, Header, Icon, Link, UserMenu } from '@sk-web-gui/react';
import { LogOut } from 'lucide-react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';
import { useShallow } from 'zustand/react/shallow';

interface PageHeaderProps extends React.ComponentProps<typeof Header> {
  headerTitle?: string;
  headerSubtitle?: string;
  logoLinkHref?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ headerSubtitle, headerTitle, logoLinkHref = '/' }) => {
  const user = useUserStore(useShallow((state) => state.user));
  const router = useRouter();
  const { t } = useTranslation();

  const handleLogoClick = () => {
    router.push(logoLinkHref);
  };

  return (
    <Header
      data-cy="nav-header"
      title={headerTitle ? headerTitle : process.env.NEXT_PUBLIC_APP_NAME}
      subtitle={headerSubtitle ? headerSubtitle : 'Sundsvalls kommun'}
      aria-label={`${headerTitle ? headerTitle : process.env.NEXT_PUBLIC_APP_NAME} ${headerSubtitle}`}
      logoLinkOnClick={handleLogoClick}
      LogoLinkWrapperComponent={<NextLink legacyBehavior href={logoLinkHref} passHref />}
      wrapperClasses="py-6 z-10"
    >
      <div className="flex justify-end gap-24 items-center">
        {user?.role === 'admin' && (
          <>
            <AdminMenu />
            <Divider orientation="vertical" />
          </>
        )}
        <UserMenu
          initials={`${user.firstName[0]}${user.lastName[0]}`}
          menuTitle={`${user.name} (${user.username})`}
          menuGroups={[
            {
              label: capitalize(t('common:logout')),
              elements: [
                {
                  label: capitalize(t('common:logout')),
                  element: () => (
                    <Link key={'logout'} href={`/logout`}>
                      <Icon icon={<LogOut />} /> {capitalize(t('common:logout'))}
                    </Link>
                  ),
                },
              ],
            },
          ]}
        />
      </div>
    </Header>
  );
};
