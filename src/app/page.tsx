"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { format, isSameMonth, startOfMonth } from "date-fns";
import { Wallet } from "lucide-react";
import { SummaryCards } from "@/components/transactions/summary-cards";
import { ChartSection } from "@/components/transactions/chart-section";
import { TransactionForm } from "@/components/transactions/transaction-form";
import { TransactionList } from "@/components/transactions/transaction-list";
import type { TransactionDTO } from "@/lib/categories";

export default function Home() {
  const [transactions, setTransactions] = useState<TransactionDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchTransactions = useCallback(async () => {
    try {
      const res = await fetch("/api/transactions", { cache: "no-store" });
      const data = await res.json();
      if (res.ok) {
        setTransactions(data.transactions ?? []);
      }
    } catch (err) {
      console.error("Failed to load transactions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  const handleAdded = useCallback((t: TransactionDTO) => {
    setTransactions((prev) => [t, ...prev]);
  }, []);

  const handleDelete = useCallback(
    async (id: string) => {
      setDeletingId(id);
      try {
        const res = await fetch(`/api/transactions/${id}`, { method: "DELETE" });
        if (res.ok) {
          setTransactions((prev) => prev.filter((t) => t.id !== id));
        }
      } catch (err) {
        console.error("Failed to delete:", err);
      } finally {
        setDeletingId(null);
      }
    },
    []
  );

  const currentMonth = startOfMonth(new Date());

  const { monthIncome, monthExpense, allTimeIncome, allTimeExpense } =
    useMemo(() => {
      let mIn = 0;
      let mOut = 0;
      let aIn = 0;
      let aOut = 0;
      for (const t of transactions) {
        if (t.type === "income") {
          aIn += t.amount;
          if (isSameMonth(new Date(t.date), currentMonth)) mIn += t.amount;
        } else {
          aOut += t.amount;
          if (isSameMonth(new Date(t.date), currentMonth)) mOut += t.amount;
        }
      }
      return { monthIncome: mIn, monthExpense: mOut, allTimeIncome: aIn, allTimeExpense: aOut };
    }, [transactions, currentMonth]);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-violet-50 via-white to-orange-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-fuchsia-600 via-violet-600 to-orange-500 text-white">
        <div className="mx-auto w-full max-w-6xl px-4 py-7 sm:py-9">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="rounded-2xl bg-white/20 p-2.5 backdrop-blur sm:p-3">
              <Wallet className="size-7 sm:size-8" aria-hidden />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                Expense Tracker
              </h1>
              <p className="text-sm text-white/80">
                Track income &amp; expenses by category and month
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-6 px-4 py-6 sm:py-8">
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="size-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600" />
          </div>
        ) : (
          <>
            <SummaryCards
              monthIncome={monthIncome}
              monthExpense={monthExpense}
              allTimeIncome={allTimeIncome}
              allTimeExpense={allTimeExpense}
              monthLabel={format(new Date(), "MMMM")}
            />

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
              <div className="lg:col-span-3">
                <ChartSection transactions={transactions} />
              </div>
              <div className="lg:col-span-2">
                <TransactionForm onAdded={handleAdded} />
              </div>
            </div>

            <TransactionList
              transactions={transactions}
              onDelete={handleDelete}
              deletingId={deletingId}
            />
          </>
        )}
      </main>

      {/* Sticky footer */}
      <footer className="mt-auto border-t border-zinc-200 bg-white/70 pb-[calc(env(safe-area-inset-bottom))] backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 py-4 text-center text-xs text-zinc-400">
          Expense Tracker · Monthly breakdown by category · Built with Next.js
        </div>
      </footer>
    </div>
  );
}
