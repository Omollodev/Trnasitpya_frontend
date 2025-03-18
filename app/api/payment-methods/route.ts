import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // In a real application, you would:
  // 1. Authenticate the user
  // 2. Fetch payment methods from database

  // Simulate payment methods data
  const paymentMethods = [
    {
      id: 1,
      type: "card",
      name: "Visa ending in 4242",
      expiryDate: "09/26",
      isDefault: true,
    },
    {
      id: 2,
      type: "mobile",
      name: "Mobile Money",
      phoneNumber: "+1 (555) 123-4567",
      isDefault: false,
    },
  ]

  return NextResponse.json({ paymentMethods })
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { type, details } = body

    // Validate input
    if (!type || !details) {
      return NextResponse.json({ error: "Payment method type and details are required" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Authenticate the user
    // 2. Validate payment details (possibly with a payment processor)
    // 3. Store payment method in database

    // Simulate payment method creation
    let paymentMethod

    if (type === "card") {
      paymentMethod = {
        id: Math.random().toString(36).substring(2, 15),
        type: "card",
        name: `${details.brand} ending in ${details.last4}`,
        expiryDate: `${details.expiryMonth}/${details.expiryYear}`,
        isDefault: details.isDefault || false,
      }
    } else if (type === "mobile") {
      paymentMethod = {
        id: Math.random().toString(36).substring(2, 15),
        type: "mobile",
        name: `${details.provider} Mobile Money`,
        phoneNumber: details.phoneNumber,
        isDefault: details.isDefault || false,
      }
    } else if (type === "bank") {
      paymentMethod = {
        id: Math.random().toString(36).substring(2, 15),
        type: "bank",
        name: `${details.bankName} Account`,
        accountNumber: `xxxx-xxxx-${details.accountNumber.slice(-4)}`,
        isDefault: details.isDefault || false,
      }
    }

    return NextResponse.json({ message: "Payment method added successfully", paymentMethod }, { status: 201 })
  } catch (error) {
    console.error("Payment method error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

