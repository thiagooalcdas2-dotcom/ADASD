import { FinanceCharts } from "@/components/charts/finance-charts";

export default function AdminFinancePage() {
  return <div className="space-y-4 py-6"><h1 className="text-2xl font-bold">Financeiro</h1><p>Abas: Despesas, Receitas, DRE simples e Relatórios CSV.</p><FinanceCharts /></div>;
}
