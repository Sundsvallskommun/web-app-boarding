'use client';

import { ReactNode, useEffect } from 'react';

export default function EmptyLayout({ title, children }: { title: string; children: ReactNode }) {
  useEffect(() => {
    if (title) document.title = title;
  }, [title]);

  return (
    <div className="EmptyLayout">
      <div className="min-h-screen">{children}</div>
    </div>
  );
}
