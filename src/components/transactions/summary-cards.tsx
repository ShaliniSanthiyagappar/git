"use client";

import { ArrowDownRight, ArrowUpRight, Wallet } from "lucide-react";
import { fmt } from "@/lib/categories";

interface SummaryCardsProps {
  monthIncome: number;
  monthExpense: number;
  allTimeIncome: number;
  allTimeExpense: number;
  monthLabel: string;
}

export function SummaryCards({
  monthIncome,
  monthExpense,
  allTimeIncome,
  allTimeExpense,
  monthLabel,
}: SummaryCardsProps) {
  const balance = monthIncome - monthExpense;
  const allTimeBalance = allTimeIncome - allTimeExpense;

  const cards = [
    {
      label: "Income",
      value: monthIncome,
      sub: `All time ${fmt(allTimeIncome)}`,
      gradient: "from-emerald-400 via-emerald-500 to-teal-500",
      Icon: ArrowUpRight,
    },
    {
      label: "Expenses",
      value: monthExpense,
      sub: `All time ${fmt(allTimeExpense)}`,
      gradient: "from-rose-500 via-pink-500 to-orange-400",
      Icon: ArrowDownRight,
    },
    {
      label: "Balance",
      value: balance,
      sub: `All time ${fmt(allTimeBalance)}`,
      gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
      Icon: Wallet,
    },
  ];

  return (
    <section
      aria-label="Monthly summary"
      className="grid grid-cols-1 gap-4 sm:grid-cols-3"
    >
      {cards.map(({ label, value, sub, gradient, Icon }) => (
        <div
          key={label}
          className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-5 text-white shadow-lg shadow-black/5 transition-transform duration-200 hover:-translate-y-0.5`}
        >
          <Icon className="absolute -right-3 -top-3 size-24 text-white/15" aria-hidden />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/80">
              {label} · {monthLabel}
            </p>
            <p className="mt-2 text-3xl font-extrabold tracking-tight">
              {fmt(Math.abs(value))}
              {label === "Balance" && value < 0 ? " −" : ""}
            </p>
            <p className="mt-1 text-xs text-white/75">{sub}</p>
          </div>
        </div>
      ))}
    </section>
  );
}
