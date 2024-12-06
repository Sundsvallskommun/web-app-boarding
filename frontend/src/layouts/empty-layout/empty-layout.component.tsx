import Head from 'next/head';
import { ReactNode } from 'react';

export default function EmptyLayout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="EmptyLayout">
      <Head>
        <title>{title}</title>
      </Head>

      <div className="min-h-screen">{children}</div>
    </div>
  );
}
