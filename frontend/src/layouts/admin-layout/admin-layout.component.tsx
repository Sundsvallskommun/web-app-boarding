import Head from 'next/head';
import AdminSidebar from '@components/admin-sidebar/admin-sidebar.component';

export default function AdminLayoutComponent({ title, children }) {
  return (
    <div className="DefaultLayout full-page-layout bg-background-100">
      <Head>
        <title>{title}</title>
      </Head>

      <div className="main-container w-full flex">
        <AdminSidebar args="" />
        <div className="w-full main-content-padding">{children}</div>
      </div>
    </div>
  );
}
