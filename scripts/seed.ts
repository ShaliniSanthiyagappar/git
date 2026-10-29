import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

function d(month: number, day: number) {
  return new Date(2026, month - 1, day, 12, 0, 0);
}

type Seed = {
  type: "income" | "expense";
  amount: number;
  category: string;
  description: string;
  date: Date;
};

const seeds: Seed[] = [
  // ===== August 2026 =====
  { type: "income", amount: 4200, category: "Salary", description: "Monthly salary", date: d(8, 1) },
  { type: "income", amount: 650, category: "Freelance", description: "Logo design project", date: d(8, 12) },
  { type: "expense", amount: 1200, category: "Bills & Utilities", description: "Apartment rent", date: d(8, 2) },
  { type: "expense", amount: 96, category: "Bills & Utilities", description: "Electricity + water", date: d(8, 5) },
  { type: "expense", amount: 142.5, category: "Groceries", description: "Weekly groceries", date: d(8, 7) },
  { type: "expense", amount: 128.3, category: "Groceries", description: "Weekly groceries", date: d(8, 16) },
  { type: "expense", amount: 58.9, category: "Food & Dining", description: "Dinner with friends", date: d(8, 9) },
  { type: "expense", amount: 32.4, category: "Food & Dining", description: "Lunch delivery", date: d(8, 19) },
  { type: "expense", amount: 75, category: "Transport", description: "Metro card top-up", date: d(8, 3) },
  { type: "expense", amount: 89.99, category: "Entertainment", description: "Concert tickets", date: d(8, 22) },
  { type: "expense", amount: 210, category: "Shopping", description: "Running shoes", date: d(8, 25) },
  // ===== September 2026 =====
  { type: "income", amount: 4200, category: "Salary", description: "Monthly salary", date: d(9, 1) },
  { type: "income", amount: 120, category: "Investments", description: "Dividend payout", date: d(9, 15) },
  { type: "income", amount: 80, category: "Gifts", description: "Birthday gift", date: d(9, 21) },
  { type: "expense", amount: 1200, category: "Bills & Utilities", description: "Apartment rent", date: d(9, 2) },
  { type: "expense", amount: 88, category: "Bills & Utilities", description: "Internet + phone", date: d(9, 6) },
  { type: "expense", amount: 156.75, category: "Groceries", description: "Weekly groceries", date: d(9, 4) },
  { type: "expense", amount: 121.4, category: "Groceries", description: "Weekly groceries", date: d(9, 14) },
  { type: "expense", amount: 64.2, category: "Food & Dining", description: "Sushi night", date: d(9, 11) },
  { type: "expense", amount: 27.8, category: "Food & Dining", description: "Coffee & pastries", date: d(9, 23) },
  { type: "expense", amount: 45, category: "Transport", description: "Fuel", date: d(9, 8) },
  { type: "expense", amount: 320, category: "Education", description: "Online course bundle", date: d(9, 17) },
  { type: "expense", amount: 55, category: "Health", description: "Pharmacy", date: d(9, 26) },
  { type: "expense", amount: 178, category: "Entertainment", description: "Weekend getaway", date: d(9, 28) },
  // ===== October 2026 =====
  { type: "income", amount: 4200, category: "Salary", description: "Monthly salary", date: d(10, 1) },
  { type: "income", amount: 900, category: "Freelance", description: "Website build", date: d(10, 14) },
  { type: "expense", amount: 1200, category: "Bills & Utilities", description: "Apartment rent", date: d(10, 2) },
  { type: "expense", amount: 92, category: "Bills & Utilities", description: "Electricity + water", date: d(10, 5) },
  { type: "expense", amount: 134.6, category: "Groceries", description: "Weekly groceries", date: d(10, 6) },
  { type: "expense", amount: 149.9, category: "Groceries", description: "Weekly groceries", date: d(10, 15) },
  { type: "expense", amount: 71.3, category: "Groceries", description: "Weekly groceries", date: d(10, 24) },
  { type: "expense", amount: 48.5, category: "Food & Dining", description: "Pizza night", date: d(10, 9) },
  { type: "expense", amount: 36.2, category: "Food & Dining", description: "Brunch", date: d(10, 18) },
  { type: "expense", amount: 24.7, category: "Food & Dining", description: "Food court", date: d(10, 26) },
  { type: "expense", amount: 60, category: "Transport", description: "Metro card + taxi", date: d(10, 7) },
  { type: "expense", amount: 260, category: "Travel", description: "Flight to visit family", date: d(10, 12) },
  { type: "expense", amount: 129.99, category: "Shopping", description: "Winter jacket", date: d(10, 20) },
  { type: "expense", amount: 65, category: "Entertainment", description: "Movie + games", date: d(10, 22) },
  { type: "expense", amount: 85, category: "Health", description: "Dentist checkup", date: d(10, 27) },
  { type: "expense", amount: 19.99, category: "Other", description: "Cloud storage plan", date: d(10, 28) },
];

async function main() {
  const count = await db.transaction.count();
  if (count > 0) {
    console.log(`Skipped seeding: ${count} transactions already exist.`);
    return;
  }
  await db.transaction.createMany({ data: seeds });
  console.log(`Seeded ${seeds.length} sample transactions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
