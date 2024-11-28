export default function Main({ children }) {
  return (
    <div className="container pb-40">
      <main id="content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
