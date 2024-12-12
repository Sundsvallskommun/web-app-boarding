import AdminSidebar from '@components/admin/admin-sidebar/admin-sidebar.component';
import { DefaultLayoutProps } from '@layouts/default-layout/default-layout.component';
import Main from '@layouts/main/main.component';
import { PageHeader } from '@layouts/page-header/page-header.component';
import { useUserStore } from '@services/user-service/user-service';
import Head from 'next/head';
import NextLink from 'next/link';
import { useTranslation } from 'react-i18next';
import { useShallow } from 'zustand/react/shallow';

export default function AdminLayoutComponent({
  title,
  postTitle,
  headerTitle,
  headerSubtitle,
  children,
  logoLinkHref = '/',
}: DefaultLayoutProps) {
  const layoutTitle = `${process.env.NEXT_PUBLIC_APP_NAME}${headerSubtitle ? ` - ${headerSubtitle}` : ''}`;
  const fullTitle = postTitle ? `${layoutTitle} - ${postTitle}` : `${layoutTitle}`;
  const { t } = useTranslation();
  const { role } = useUserStore(useShallow((state) => state.user));
  const setFocusToMain = () => {
    const contentElement = document.getElementById('content');
    if (contentElement) {
      contentElement.focus();
    }
  };

  return role !== 'admin' ?
      <></>
    : <div className="DefaultLayout full-page-layout bg-background-100">
        <Head>
          <title>{title ? title : fullTitle}</title>
          <meta name="description" content={title ? title : `${process.env.NEXT_PUBLIC_APP_NAME}`} />
        </Head>

        <NextLink href="#content" legacyBehavior passHref>
          <a onClick={setFocusToMain} accessKey="s" className="next-link-a" data-cy="systemMessage-a">
            {t('layout:header.goto_content')}
          </a>
        </NextLink>

        <PageHeader headerSubtitle={headerSubtitle} headerTitle={headerTitle} logoLinkHref={logoLinkHref} />

        <div className="main-container w-full h-full flex">
          <AdminSidebar />
          <Main className="w-full p-40">{children}</Main>
        </div>
      </div>;
}
