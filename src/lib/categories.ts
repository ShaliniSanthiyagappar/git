import {
  Briefcase,
  Car,
  Clapperboard,
  Gift,
  GraduationCap,
  HeartPulse,
  Laptop,
  Package,
  Plane,
  ReceiptText,
  ShoppingBag,
  ShoppingCart,
  TrendingUp,
  UtensilsCrossed,
  CirclePlus,
  type LucideIcon,
} from "lucide-react";

export type TxType = "income" | "expense";

export interface CategoryDef {
  name: string;
  color: string;
  icon: LucideIcon;
}

export interface TransactionDTO {
  id: string;
  type: TxType;
  amount: number;
  category: string;
  description: string | null;
  date: string;
  createdAt: string;
  updatedAt: string;
}

// Vibrant palette — expense categories
export const EXPENSE_CATEGORIES: CategoryDef[] = [
  { name: "Food & Dining", color: "#f97316", icon: UtensilsCrossed },
  { name: "Groceries", color: "#84cc16", icon: ShoppingCart },
  { name: "Transport", color: "#06b6d4", icon: Car },
  { name: "Shopping", color: "#ec4899", icon: ShoppingBag },
  { name: "Entertainment", color: "#8b5cf6", icon: Clapperboard },
  { name: "Bills & Utilities", color: "#eab308", icon: ReceiptText },
  { name: "Health", color: "#10b981", icon: HeartPulse },
  { name: "Education", color: "#d946ef", icon: GraduationCap },
  { name: "Travel", color: "#14b8a6", icon: Plane },
  { name: "Other", color: "#f43f5e", icon: Package },
];

// Vibrant palette — income categories
export const INCOME_CATEGORIES: CategoryDef[] = [
  { name: "Salary", color: "#22c55e", icon: Briefcase },
  { name: "Freelance", color: "#14b8a6", icon: Laptop },
  { name: "Investments", color: "#84cc16", icon: TrendingUp },
  { name: "Gifts", color: "#f59e0b", icon: Gift },
  { name: "Other Income", color: "#d946ef", icon: CirclePlus },
];

export const ALL_CATEGORIES: CategoryDef[] = [
  ...EXPENSE_CATEGORIES,
  ...INCOME_CATEGORIES,
];

export function categoriesFor(type: TxType): CategoryDef[] {
  return type === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;
}

export function getCategory(name: string): CategoryDef {
  return (
    ALL_CATEGORIES.find((c) => c.name === name) ?? {
      name,
      color: "#a1a1aa",
      icon: Package,
    }
  );
}

export function fmt(n: number): string {
  return (
    "$" +
    n.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    })
  );
}
