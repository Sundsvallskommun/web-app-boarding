'use client';

import { PageHeader } from '@layouts/page-header/page-header.component';
import { useChecklist } from '@services/checklist-service/use-checklist';
import { useUserStore } from '@services/user-service/user-service';
import Breadcrumb from '@sk-web-gui/breadcrumb';
import NextLink from 'next/link';
import { usePathname } from 'next/navigation';
import { capitalize } from 'underscore.string';
import { useShallow } from 'zustand/react/shallow';
import React, { useEffect } from 'react';
import { InfoBanner } from '@components/common/info-banner/info-banner.component';
import { useTranslation } from 'react-i18next';

export interface DefaultLayoutProps {
  children: React.ReactNode;
  title?: string;
  postTitle?: string;
  headerTitle?: string;
  headerSubtitle?: string;
  preContent?: React.ReactNode;
  postContent?: React.ReactNode;
  logoLinkHref?: string;
}

export default function DefaultLayout({
  title,
  postTitle,
  headerTitle,
  headerSubtitle,
  children,
  preContent = undefined,
  postContent = undefined,
  logoLinkHref = '/',
}: DefaultLayoutProps) {
  const layoutTitle = `${process.env.NEXT_PUBLIC_APP_NAME}${headerSubtitle ? ` - ${headerSubtitle}` : ''}`;
  const fullTitle = postTitle ? `${layoutTitle} - ${postTitle}` : `${layoutTitle}`;
  const pathname = usePathname();
  const user = useUserStore(useShallow((s) => s.user));

  const { t } = useTranslation();

  const setFocusToMain = () => {
    const contentElement = document.getElementById('content');
    if (contentElement) {
      contentElement.focus();
    }
  };

  useEffect(() => {
    document.title = title || fullTitle;
  }, [title, fullTitle]);

  const { data } = useChecklist();

  return (
    <div className="DefaultLayout full-page-layout bg-background-100">
      <InfoBanner />

      <NextLink href="#content" onClick={setFocusToMain} className="next-link-a" data-cy="systemMessage-a">
        {t('layout:header.goto_content')}
      </NextLink>

      <div>
        <PageHeader headerSubtitle={headerSubtitle} headerTitle={headerTitle || title} logoLinkHref={logoLinkHref} />

        <div className="main-container flex-grow relative w-full flex flex-col pt-20">
          {pathname && pathname !== '/' && !pathname.includes('/admin') && user.permissions.isManager ?
            <div className="w-full">
              <Breadcrumb className="container ">
                <Breadcrumb.Item>
                  <Breadcrumb.Link href="../">{capitalize(t('common:start'))}</Breadcrumb.Link>
                </Breadcrumb.Item>

                <Breadcrumb.Item currentPage>
                  <Breadcrumb.Link href="#">
                    {data?.employee?.firstName} {data?.employee?.lastName}
                  </Breadcrumb.Link>
                </Breadcrumb.Item>
              </Breadcrumb>
            </div>
          : null}
        </div>
      </div>

      {preContent && preContent}

      <div className={`main-container flex-grow relative w-full flex flex-col mb-40`}>
        <div className="container max-width-content w-full">{children}</div>
      </div>

      {postContent && postContent}
    </div>
  );
}
