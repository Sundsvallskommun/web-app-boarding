export default function Main({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="pb-40">
      <main id="content" className={className}>
        {children}
      </main>
    </div>
  );
}
