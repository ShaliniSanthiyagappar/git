"use client";

import { useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, isSameMonth, startOfMonth, subMonths } from "date-fns";
import {
  categoriesFor,
  fmt,
  type TransactionDTO,
  type TxType,
} from "@/lib/categories";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart3, PieChart } from "lucide-react";

interface ChartSectionProps {
  transactions: TransactionDTO[];
}

type ChartMode = "trend" | "split";

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ dataKey?: string | number; value?: number; color?: string; fill?: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const items = payload.filter((p) => typeof p.value === "number" && p.value > 0);
  const total = items.reduce((s, p) => s + (p.value ?? 0), 0);
  return (
    <div className="rounded-xl border border-zinc-200 bg-white/95 px-3 py-2 text-xs shadow-xl backdrop-blur">
      <p className="mb-1.5 font-bold text-zinc-800">{label}</p>
      {items.length === 0 && <p className="text-zinc-400">No data</p>}
      {items.map((p) => (
        <div key={String(p.dataKey)} className="flex items-center gap-2 py-0.5">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ background: p.color || p.fill }}
          />
          <span className="text-zinc-500">{p.dataKey}</span>
          <span className="ml-auto font-semibold text-zinc-800">
            {fmt(p.value ?? 0)}
          </span>
        </div>
      ))}
      {items.length > 1 && (
        <div className="mt-1.5 flex items-center gap-2 border-t border-zinc-200 pt-1.5 font-bold text-zinc-800">
          <span>Total</span>
          <span className="ml-auto">{fmt(total)}</span>
        </div>
      )}
    </div>
  );
}

export function ChartSection({ transactions }: ChartSectionProps) {
  const [activeType, setActiveType] = useState<TxType>("expense");
  const [mode, setMode] = useState<ChartMode>("trend");

  // Last 6 months window (oldest → newest)
  const monthsWindow = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }, (_, i) =>
      subMonths(startOfMonth(now), 5 - i)
    );
  }, []);

  const [selectedMonthKey, setSelectedMonthKey] = useState<string>(
    format(new Date(), "yyyy-MM")
  );

  // Stacked monthly data: one row per month, one key per category
  const trendData = useMemo(() => {
    const cats = categoriesFor(activeType);
    return monthsWindow.map((m) => {
      const entry: Record<string, string | number> = {
        month: format(m, "MMM"),
        monthKey: format(m, "yyyy-MM"),
      };
      for (const c of cats) entry[c.name] = 0;
      for (const t of transactions) {
        if (t.type !== activeType) continue;
        if (isSameMonth(new Date(t.date), m)) {
          entry[t.category] = ((entry[t.category] as number) || 0) + t.amount;
        }
      }
      return entry;
    });
  }, [transactions, activeType, monthsWindow]);

  // Categories actually present in the 6-month window (for legend + stacked bars)
  const activeCategories = useMemo(() => {
    const cats = categoriesFor(activeType);
    return cats.filter((c) =>
      trendData.some((row) => (row[c.name] as number) > 0)
    );
  }, [trendData, activeType]);

  // Per-category totals for the selected month
  const selectedMonthDate = useMemo(() => {
    const [y, m] = selectedMonthKey.split("-").map(Number);
    return new Date(y, m - 1, 1);
  }, [selectedMonthKey]);

  const splitData = useMemo(() => {
    return categoriesFor(activeType)
      .map((c) => ({
        name: c.name,
        color: c.color,
        total: transactions
          .filter(
            (t) =>
              t.type === activeType &&
              t.category === c.name &&
              isSameMonth(new Date(t.date), selectedMonthDate)
          )
          .reduce((s, t) => s + t.amount, 0),
      }))
      .filter((d) => d.total > 0)
      .sort((a, b) => b.total - a.total);
  }, [transactions, activeType, selectedMonthDate]);

  const typeToggle = (
    <div className="inline-flex rounded-full border border-zinc-200 bg-white p-1 shadow-sm">
      {(
        [
          { key: "expense", label: "Expenses", active: "bg-rose-500 text-white shadow" },
          { key: "income", label: "Income", active: "bg-emerald-500 text-white shadow" },
        ] as const
      ).map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => setActiveType(opt.key)}
          aria-pressed={activeType === opt.key}
          className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all sm:text-sm ${
            activeType === opt.key
              ? opt.active
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );

  const modeToggle = (
    <div className="inline-flex rounded-full border border-zinc-200 bg-white p-1 shadow-sm">
      {(
        [
          { key: "trend", label: "Monthly Trend", Icon: BarChart3 },
          { key: "split", label: "By Category", Icon: PieChart },
        ] as const
      ).map((opt) => (
        <button
          key={opt.key}
          type="button"
          onClick={() => setMode(opt.key)}
          aria-pressed={mode === opt.key}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition-all sm:text-sm ${
            mode === opt.key
              ? "bg-zinc-900 text-white shadow"
              : "text-zinc-500 hover:text-zinc-800"
          }`}
        >
          <opt.Icon className="size-3.5" />
          {opt.label}
        </button>
      ))}
    </div>
  );

  return (
    <section
      aria-label="Charts"
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          {typeToggle}
          {modeToggle}
        </div>
        {mode === "split" && (
          <Select value={selectedMonthKey} onValueChange={setSelectedMonthKey}>
            <SelectTrigger className="w-full sm:w-[180px]" aria-label="Select month">
              <SelectValue placeholder="Pick a month" />
            </SelectTrigger>
            <SelectContent>
              {[...monthsWindow].reverse().map((m) => {
                const key = format(m, "yyyy-MM");
                return (
                  <SelectItem key={key} value={key}>
                    {format(m, "MMMM yyyy")}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Stacked monthly bars — one bar per month, separated by category */}
      {mode === "trend" && (
        <div>
          <div className="h-[320px] w-full sm:h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trendData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#e4e4e7" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "#71717a", fontWeight: 600 }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#a1a1aa" }}
                  tickFormatter={(v: number) => (v === 0 ? "0" : `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`)}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ fill: "rgba(0,0,0,0.04)", radius: 8 }}
                />
                {activeCategories.map((c) => (
                  <Bar
                    key={c.name}
                    dataKey={c.name}
                    stackId="a"
                    fill={c.color}
                    maxBarSize={56}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Vibrant legend */}
          {activeCategories.length > 0 ? (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
              {activeCategories.map((c) => (
                <span key={c.name} className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600">
                  <span className="size-2.5 rounded-full" style={{ background: c.color }} />
                  {c.name}
                </span>
              ))}
            </div>
          ) : (
            <p className="mt-4 text-center text-sm text-zinc-400">
              No {activeType === "expense" ? "expenses" : "income"} recorded in the last 6 months
            </p>
          )}
        </div>
      )}

      {/* Per-category bars for the selected month */}
      {mode === "split" && (
        <div>
          {splitData.length > 0 ? (
            <>
              <div className="h-[320px] w-full sm:h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={splitData}
                    layout="vertical"
                    margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
                  >
                    <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#e4e4e7" />
                    <XAxis
                      type="number"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#a1a1aa" }}
                      tickFormatter={(v: number) => `$${v >= 1000 ? `${(v / 1000).toFixed(1)}k` : v}`}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={110}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 12, fill: "#3f3f46", fontWeight: 600 }}
                    />
                    <Tooltip
                      content={<ChartTooltip />}
                      cursor={{ fill: "rgba(0,0,0,0.04)", radius: 8 }}
                    />
                    <Bar dataKey="total" name="Total" radius={[0, 8, 8, 0]} maxBarSize={28}>
                      {splitData.map((d) => (
                        <Cell key={d.name} fill={d.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <p className="mt-3 text-center text-sm text-zinc-500">
                {format(selectedMonthDate, "MMMM yyyy")} ·{" "}
                <span className="font-semibold text-zinc-700">
                  {fmt(splitData.reduce((s, d) => s + d.total, 0))}
                </span>{" "}
                total {activeType === "expense" ? "spent" : "earned"} across{" "}
                {splitData.length} {splitData.length === 1 ? "category" : "categories"}
              </p>
            </>
          ) : (
            <div className="flex h-[320px] items-center justify-center text-sm text-zinc-400 sm:h-[360px]">
              No {activeType === "expense" ? "expenses" : "income"} in{" "}
              {format(selectedMonthDate, "MMMM yyyy")}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
