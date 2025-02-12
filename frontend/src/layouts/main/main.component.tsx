export default function Main({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div>
      <main id="content" className={className}>
        {children}
      </main>
    </div>
  );
}
