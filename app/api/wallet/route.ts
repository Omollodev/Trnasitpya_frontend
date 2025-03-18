import { NextResponse } from 'next/server';

export async function GET() {
  // Simulate fetching wallet balance from database
  const wallet = {
    balance: 1000,
    lastUpdated: new Date().toISOString(),
  };

  return NextResponse.json({ wallet });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, paymentMethod } = body;

    // Validate input
    if (!amount || !paymentMethod) {
      return NextResponse.json({ error: "Amount and payment method are required" }, { status: 400 });
    }

    // In a real application, you would:
    // 1. Authenticate the user
    // 2. Process payment through payment gateway
    // 3. Update wallet balance in database
    // 4. Record transaction

    // Simulate wallet top-up
    const transaction = {
      id: Math.random().toString(36).substring(2, 15),
      amount,
      paymentMethod,
      date: new Date().toISOString(),
    };

    // Simulate updated wallet balance
    const wallet = {
      balance: 1000 + amount,
      lastUpdated: new Date().toISOString(),
    };

    return NextResponse.json({ message: "Wallet topped up successfully", transaction, wallet });
  } catch (error) {
    return NextResponse.json({ error: "An error occurred" }, { status: 500 });
  }
}