import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email, phone, subject, message } = body

    // Validate input
    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required" }, { status: 400 })
    }

    // In a real application, you would:
    // 1. Process the contact form submission
    // 2. Send an email notification
    // 3. Store the contact request in the database

    console.log("Contact form submission:", {
      name,
      email,
      phone,
      subject,
      message,
    })

    return NextResponse.json({
      message: "Your message has been sent successfully",
    })
  } catch (error) {
    console.error("Contact form error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

