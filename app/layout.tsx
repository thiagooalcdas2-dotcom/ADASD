import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <header className="border-b bg-white">
          <div className="container-page flex items-center justify-between py-3">
            <Link href="/" className="font-bold text-brand-700">Restaurante SaaS</Link>
            <nav className="flex gap-3 text-sm">
              <Link href="/menu">Cardápio</Link>
              <Link href="/order/new">Pedir</Link>
              <Link href="/reservations">Reservas</Link>
              <Link href="/support">Suporte</Link>
              <Link href="/admin/dashboard">Admin</Link>
            </nav>
          </div>
        </header>
        <main className="container-page">{children}</main>
      </body>
    </html>
  );
}
