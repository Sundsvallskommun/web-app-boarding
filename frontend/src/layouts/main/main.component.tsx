export default function Main({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className="flex-grow flex">
      <main id="content" className={`${className}`}>
        {children}
      </main>
    </div>
  );
}
