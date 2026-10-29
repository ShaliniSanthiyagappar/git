"use client";

import { format } from "date-fns";
import { Loader2, Trash2, Wallet } from "lucide-react";
import { fmt, getCategory, type TransactionDTO } from "@/lib/categories";
import { cn } from "@/lib/utils";

interface TransactionListProps {
  transactions: TransactionDTO[];
  onDelete: (id: string) => void;
  deletingId: string | null;
}

export function TransactionList({
  transactions,
  onDelete,
  deletingId,
}: TransactionListProps) {
  return (
    <section
      aria-label="Transaction history"
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-zinc-900">History</h2>
        <span className="text-xs font-medium text-zinc-400">
          {transactions.length} {transactions.length === 1 ? "record" : "records"}
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-zinc-200 py-12 text-center">
          <Wallet className="mb-3 size-10 text-zinc-300" aria-hidden />
          <p className="font-semibold text-zinc-500">No transactions yet</p>
          <p className="mt-1 text-sm text-zinc-400">
            Add your first income or expense using the form above
          </p>
        </div>
      ) : (
        <ul
          className="max-h-[420px] space-y-2 overflow-y-auto pr-1
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-zinc-300
            [&::-webkit-scrollbar]:w-1.5"
        >
          {transactions.map((t) => {
            const cat = getCategory(t.category);
            const Icon = cat.icon;
            const isIncome = t.type === "income";
            return (
              <li
                key={t.id}
                className="group flex items-center gap-3 rounded-xl border border-zinc-100 bg-zinc-50/60 px-3 py-2.5 transition-colors hover:bg-zinc-50"
              >
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full"
                  style={{ background: `${cat.color}1f` }}
                  aria-hidden
                >
                  <Icon className="size-4" style={{ color: cat.color }} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-800">
                    {t.description || t.category}
                  </p>
                  <p className="text-xs text-zinc-400">
                    <span
                      className="mr-1.5 inline-block size-1.5 rounded-full align-middle"
                      style={{ background: cat.color }}
                    />
                    {t.category} · {format(new Date(t.date), "MMM d, yyyy")}
                  </p>
                </div>
                <span
                  className={cn(
                    "shrink-0 text-sm font-bold tabular-nums",
                    isIncome ? "text-emerald-600" : "text-rose-500"
                  )}
                >
                  {isIncome ? "+" : "−"}
                  {fmt(t.amount)}
                </span>
                <button
                  type="button"
                  onClick={() => onDelete(t.id)}
                  aria-label={`Delete ${t.description || t.category}`}
                  className="shrink-0 rounded-lg p-2 text-zinc-300 transition-colors hover:bg-rose-50 hover:text-rose-500"
                >
                  {deletingId === t.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
