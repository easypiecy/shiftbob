export default function Loading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <section className="bob-loader-shell" aria-label="Siden loader" role="status">
        <div className="bob-loader-row" aria-hidden="true">
          <span className="bob-orb bob-orb-1">B</span>
          <span className="bob-orb bob-orb-2">O</span>
          <span className="bob-orb bob-orb-3">B</span>
        </div>
      </section>
    </main>
  );
}
