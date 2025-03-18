import { NextResponse } from "next/server"
import axios from "axios"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    // Make request to Django backend
    const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login/`, {
      email,
      password
    })

    // Get the cookies configuration
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      // Set expiry to match JWT expiry
      maxAge: 7 * 24 * 60 * 60 // 7 days
    }

    // Create the response
    const responseData = response.data
    const nextResponse = NextResponse.json({
      user: responseData.user,
      message: "Login successful"
    })

    // Set HTTP-only cookies
    nextResponse.cookies.set("accessToken", responseData.tokens.access, cookieOptions)
    nextResponse.cookies.set("refreshToken", responseData.tokens.refresh, cookieOptions)

    return nextResponse
  } catch (error: any) {
    // Handle different types of errors
    if (error.response) {
      // Backend error response
      return NextResponse.json(
        { error: error.response.data.error || "Authentication failed" },
        { status: error.response.status }
      )
    } else if (error.request) {
      // Network error
      return NextResponse.json(
        { error: "Network error. Please try again." },
        { status: 503 }
      )
    } else {
      // Other errors
      return NextResponse.json(
        { error: "An unexpected error occurred" },
        { status: 500 }
      )
    }
  }
}

