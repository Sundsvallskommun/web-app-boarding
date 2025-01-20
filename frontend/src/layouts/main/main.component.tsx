export default function Main({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="pb-40 flex-grow">
      <main id="content" className={className}>
        {children}
      </main>
    </div>
  );
}
