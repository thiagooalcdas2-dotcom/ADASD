export function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-white p-4 shadow-sm">
      <h3 className="mb-3 font-semibold">{title}</h3>
      {children}
    </section>
  );
}
