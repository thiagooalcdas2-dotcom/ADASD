"use client";

import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Cell } from "recharts";

export function FinanceCharts() {
  const revenue = [
    { day: "Seg", amount: 1200 },
    { day: "Ter", amount: 1400 },
    { day: "Qua", amount: 1600 },
    { day: "Qui", amount: 1550 },
    { day: "Sex", amount: 2100 }
  ];
  const expenses = [
    { name: "Folha", value: 4500 },
    { name: "Insumos", value: 2300 },
    { name: "Marketing", value: 900 }
  ];
  const profit = [
    { period: "Sem 1", value: 4200 },
    { period: "Sem 2", value: 3900 },
    { period: "Sem 3", value: 5300 },
    { period: "Sem 4", value: 6100 }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="h-64 rounded-xl border bg-white p-2"><ResponsiveContainer><LineChart data={revenue}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="day" /><YAxis /><Tooltip /><Line dataKey="amount" stroke="#0f766e" /></LineChart></ResponsiveContainer></div>
      <div className="h-64 rounded-xl border bg-white p-2"><ResponsiveContainer><PieChart><Pie data={expenses} dataKey="value" nameKey="name" outerRadius={80}>{expenses.map((_, i) => <Cell key={i} fill={["#0f766e", "#f59e0b", "#8b5cf6"][i]} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></div>
      <div className="h-64 rounded-xl border bg-white p-2"><ResponsiveContainer><BarChart data={profit}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="period" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#115e59" /></BarChart></ResponsiveContainer></div>
    </div>
  );
}
