import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // In a real application, you would:
  // 1. Authenticate the user
  // 2. Fetch tickets from database

  // Simulate tickets data
  const tickets = [
    {
      id: 1,
      type: "Day Pass",
      validUntil: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      purchaseDate: new Date().toISOString(),
      price: 5.0,
    },
    {
      id: 2,
      type: "Monthly Pass",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      status: "active",
      purchaseDate: new Date().toISOString(),
      price: 75.0,
    },
    {
      id: 3,
      type: "Single Ride",
      validUntil: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: "used",
      purchaseDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      price: 2.5,
    },
  ]

  return NextResponse.json({ tickets })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, paymentMethod } = body

    // Validate input
    if (!type || !paymentMethod) {
      return NextResponse.json({ error: "Ticket type and payment method are required" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Authenticate the user
    // 2. Process payment
    // 3. Create ticket in database
    // 4. Generate QR code

    // Simulate ticket creation
    const ticketPrices = {
      "Single Ride": 2.5,
      "Day Pass": 5.0,
      "Weekly Pass": 25.0,
      "Monthly Pass": 75.0,
    }

    const price = ticketPrices[type as keyof typeof ticketPrices] || 0

    const ticket = {
      id: Math.random().toString(36).substring(2, 15),
      type,
      validUntil:
        type === "Single Ride"
          ? new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 hours
          : type === "Day Pass"
            ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
            : type === "Weekly Pass"
              ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
              : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days
      status: "active",
      purchaseDate: new Date().toISOString(),
      price,
      paymentMethod,
    }

    return NextResponse.json({ message: "Ticket purchased successfully", ticket }, { status: 201 })
  } catch (error) {
    console.error("Ticket purchase error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

