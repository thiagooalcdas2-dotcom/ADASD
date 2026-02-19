export function Table({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-auto rounded-lg border bg-white">
      <table className="min-w-full text-sm">
        <thead className="bg-slate-100">
          <tr>{headers.map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t">{row.map((c, j) => <td key={j} className="px-3 py-2">{c}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
