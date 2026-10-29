# Expense Tracker

A vibrant, responsive expense tracker web app to record income & expenses, organize them by category, and visualize monthly breakdowns in bar charts.

## Features

- **Monthly bar chart** — last 6 months of expenses/income, stacked and separated by category, each in its own vibrant color
- **By Category view** — horizontal bar breakdown per category for any selected month
- **Expenses / Income toggle** — switch the entire analytics view between money in and money out
- **Add transactions** — amount, calendar date picker, category chips with icons, and an optional description
- **Categories** — 10 expense categories (Food & Dining, Groceries, Transport, Shopping, Entertainment, Bills & Utilities, Health, Education, Travel, Other) and 5 income categories (Salary, Freelance, Investments, Gifts, Other Income)
- **Summary cards** — Income, Expenses and Balance for the current month, plus all-time totals
- **History** — scrollable transaction list with delete support and toast notifications
- **Responsive** — works on mobile and desktop

## Tech Stack

- [Next.js](https://nextjs.org/) 16 (App Router) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) 4 + shadcn/ui components
- [Prisma](https://www.prisma.io/) ORM with SQLite
- [Recharts](https://recharts.org/) for charts

## Getting Started

1. Install dependencies:

   ```bash
   bun install
   # or: npm install
   ```

2. Create your env file:

   ```bash
   cp .env.example .env
   ```

3. Push the database schema:

   ```bash
   bun run db:push
   # or: npx prisma db push
   ```

4. (Optional) Seed sample data:

   ```bash
   bun scripts/seed.ts
   ```

5. Start the dev server:

   ```bash
   bun run dev
   # or: npm run dev
   ```

Open http://localhost:3000 to use the tracker.

## API Routes

| Method | Endpoint                  | Description              |
| ------ | ------------------------- | ------------------------ |
| GET    | `/api/transactions`       | List all transactions    |
| POST   | `/api/transactions`       | Create a transaction     |
| DELETE | `/api/transactions/[id]`  | Delete a transaction     |
