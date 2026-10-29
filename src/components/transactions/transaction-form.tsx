"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, Loader2 } from "lucide-react";
import {
  categoriesFor,
  fmt,
  type TransactionDTO,
  type TxType,
} from "@/lib/categories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface TransactionFormProps {
  onAdded: (t: TransactionDTO) => void;
}

export function TransactionForm({ onAdded }: TransactionFormProps) {
  const [type, setType] = useState<TxType>("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Food & Dining");
  const [date, setDate] = useState<Date>(new Date());
  const [dateOpen, setDateOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const cats = categoriesFor(type);
  const isExpense = type === "expense";

  function switchType(next: TxType) {
    setType(next);
    setCategory(categoriesFor(next)[0].name);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = Number(amount);
    if (!amount || !Number.isFinite(parsed) || parsed <= 0) {
      toast({
        title: "Invalid amount",
        description: "Please enter an amount greater than 0.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          amount: parsed,
          category,
          description,
          date: date.toISOString(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      toast({
        title: isExpense ? "Expense added" : "Income added",
        description: `${category} · ${fmt(parsed)} on ${format(date, "MMM d, yyyy")}`,
      });
      onAdded(data.transaction as TransactionDTO);
      setAmount("");
      setDescription("");
    } catch (err) {
      toast({
        title: "Failed to add transaction",
        description: err instanceof Error ? err.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      aria-label="Add transaction"
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm sm:p-6"
    >
      <h2 className="mb-4 text-lg font-bold text-zinc-900">Add Transaction</h2>

      {/* Type toggle */}
      <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-zinc-100 p-1">
        <button
          type="button"
          onClick={() => switchType("expense")}
          aria-pressed={isExpense}
          className={cn(
            "rounded-lg py-2 text-sm font-bold transition-all",
            isExpense
              ? "bg-gradient-to-r from-rose-500 to-orange-400 text-white shadow"
              : "text-zinc-500 hover:text-zinc-800"
          )}
        >
          Expense
        </button>
        <button
          type="button"
          onClick={() => switchType("income")}
          aria-pressed={!isExpense}
          className={cn(
            "rounded-lg py-2 text-sm font-bold transition-all",
            !isExpense
              ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow"
              : "text-zinc-500 hover:text-zinc-800"
          )}
        >
          Income
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount + Date */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-zinc-400">
                $
              </span>
              <Input
                id="amount"
                type="number"
                min="0.01"
                step="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="pl-7 font-semibold"
                required
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="date">Date</Label>
            <Popover open={dateOpen} onOpenChange={setDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  id="date"
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-semibold",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-1 size-4 shrink-0 text-zinc-400" />
                  <span className="truncate text-sm">
                    {date ? format(date, "MMM d, yyyy") : "Pick a date"}
                  </span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    if (d) {
                      setDate(d);
                      setDateOpen(false);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Category chips — vibrant */}
        <div className="space-y-1.5">
          <Label>Category</Label>
          <div className="flex flex-wrap gap-2">
            {cats.map((c) => {
              const selected = category === c.name;
              const Icon = c.icon;
              return (
                <button
                  key={c.name}
                  type="button"
                  onClick={() => setCategory(c.name)}
                  aria-pressed={selected}
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all",
                    selected
                      ? "border-transparent text-white shadow-md"
                      : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-300 hover:bg-zinc-50"
                  )}
                  style={selected ? { background: c.color } : undefined}
                >
                  <Icon
                    className="size-3.5"
                    style={selected ? undefined : { color: c.color }}
                  />
                  {c.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="description">Description</Label>
          <Input
            id="description"
            type="text"
            placeholder={isExpense ? "e.g. Lunch with team" : "e.g. October salary"}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={80}
          />
        </div>

        <Button
          type="submit"
          disabled={submitting}
          className={cn(
            "w-full bg-gradient-to-r py-2.5 text-sm font-bold text-white shadow-md transition-all hover:opacity-90",
            isExpense
              ? "from-rose-500 to-orange-400 hover:from-rose-600 hover:to-orange-500"
              : "from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
          )}
        >
          {submitting ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Adding...
            </>
          ) : isExpense ? (
            "Add Expense"
          ) : (
            "Add Income"
          )}
        </Button>
      </form>
    </section>
  );
}
