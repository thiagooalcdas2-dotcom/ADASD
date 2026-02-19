import { Card } from "@/components/ui/card";

export default function HomePage() {
  return (
    <div className="space-y-4 py-6">
      <h1 className="text-3xl font-bold">Plataforma completa do restaurante</h1>
      <div className="grid gap-4 md:grid-cols-3">
        <Card title="Atendimento">Pedidos, reservas e suporte com status em tempo real.</Card>
        <Card title="Operação">Fila de pedidos, tickets e reservas para equipe.</Card>
        <Card title="Admin + TAZ">Financeiro, relatórios CSV e auditoria centralizada.</Card>
      </div>
    </div>
  );
}
