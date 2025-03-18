import { NextResponse } from "next/server"
import axios from "axios"

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

export async function GET(request: Request) {
  try {
    // Get authorization header from the request
    const authHeader = request.headers.get("authorization")
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]

    // Make request to Django backend to verify the token and get user info
    try {
      const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/profile/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      // Check if the user data includes role or isAdmin information and pass it along
      let userData = response.data;
      
      // If the backend doesn't provide role/admin info, we can add that processing here
      // For example, we could check if the email belongs to an admin domain or check against a list
      
      // Return the user data to the client, preserving any isAdmin or role fields from the backend
      return NextResponse.json(userData, { status: 200 })
    } catch (error: any) {
      // Handle backend errors
      if (error.response) {
        // If token is invalid or expired
        if (error.response.status === 401) {
          return NextResponse.json({ error: "Session expired" }, { status: 401 })
        }
        return NextResponse.json(
          { error: error.response.data.error || "Profile retrieval failed" },
          { status: error.response.status }
        )
      } else {
        // Network or other errors
        return NextResponse.json(
          { error: "Error connecting to authentication service" },
          { status: 500 }
        )
      }
    }
  } catch (error) {
    console.error("Profile retrieval error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

