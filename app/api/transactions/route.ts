import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // In a real application, you would:
  // 1. Authenticate the user
  // 2. Fetch transactions from database
  // 3. Apply filters and pagination

  // Simulate transactions data
  const transactions = [
    {
      id: 1,
      type: "Top Up",
      amount: 50.0,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      method: "Credit Card",
      status: "completed",
    },
    {
      id: 2,
      type: "Fare Payment",
      amount: -2.5,
      date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      method: "Wallet Balance",
      status: "completed",
    },
    {
      id: 3,
      type: "Top Up",
      amount: 20.0,
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      method: "Mobile Money",
      status: "completed",
    },
    {
      id: 4,
      type: "Fare Payment",
      amount: -3.75,
      date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString(),
      method: "Wallet Balance",
      status: "completed",
    },
    {
      id: 5,
      type: "Fare Payment",
      amount: -2.5,
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      method: "Wallet Balance",
      status: "completed",
    },
  ]

  return NextResponse.json({ transactions })
}

