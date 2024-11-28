import AdminSidebar from '@components/admin/admin-sidebar/admin-sidebar.component';
import Main from '@layouts/main/main.component';
import Head from 'next/head';

export default function AdminLayoutComponent({ title, children }) {
  return (
    <div className="DefaultLayout full-page-layout bg-background-100">
      <Head>
        <title>{title}</title>
      </Head>

      <div className="main-container w-full flex">
        <AdminSidebar />
        <Main className="w-full p-40">{children}</Main>
      </div>
    </div>
  );
}
