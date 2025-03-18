import { NextResponse } from "next/server"

// This would be connected to your database in a real application
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, phone, password } = body

    // Validate input
    if (!fullName || !email || !phone || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Check if user already exists
    // 2. Hash the password
    // 3. Store user in database
    // 4. Generate verification token
    // 5. Send verification email/SMS

    // Simulate user creation
    const user = {
      id: Math.random().toString(36).substring(2, 15),
      fullName,
      email,
      phone,
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json(
      {
        message: "User registered successfully",
        user: { id: user.id, fullName: user.fullName, email: user.email },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

