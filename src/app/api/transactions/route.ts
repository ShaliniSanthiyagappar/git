import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/transactions — list all transactions (newest first)
export async function GET() {
  try {
    const transactions = await db.transaction.findMany({
      orderBy: [{ date: "desc" }, { createdAt: "desc" }],
    });
    return NextResponse.json({ transactions });
  } catch (error) {
    console.error("GET /api/transactions error:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}

// POST /api/transactions — create a new transaction
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, amount, category, description, date } = body;

    // Validation
    if (type !== "income" && type !== "expense") {
      return NextResponse.json(
        { error: "Type must be 'income' or 'expense'" },
        { status: 400 }
      );
    }
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }
    if (!category || typeof category !== "string" || !category.trim()) {
      return NextResponse.json(
        { error: "Category is required" },
        { status: 400 }
      );
    }
    const parsedDate = new Date(date);
    if (!date || isNaN(parsedDate.getTime())) {
      return NextResponse.json(
        { error: "A valid date is required" },
        { status: 400 }
      );
    }

    const transaction = await db.transaction.create({
      data: {
        type,
        amount: Math.round(parsedAmount * 100) / 100,
        category: category.trim(),
        description: typeof description === "string" && description.trim() ? description.trim() : null,
        date: parsedDate,
      },
    });

    return NextResponse.json({ transaction }, { status: 201 });
  } catch (error) {
    console.error("POST /api/transactions error:", error);
    return NextResponse.json(
      { error: "Failed to create transaction" },
      { status: 500 }
    );
  }
}
