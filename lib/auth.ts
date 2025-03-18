import { cookies } from "next/headers"
import { getUserByEmail } from "./db"

// Mock function to simulate password hashing
const hashPassword = (password: string): string => {
  return `hashed_${password}`
}

// Mock function to simulate password verification
const verifyPassword = (password: string, hashedPassword: string): boolean => {
  return hashedPassword === `hashed_${password}`
}

// Mock function to generate a JWT token
const generateToken = (userId: string): string => {
  return `mock_jwt_token_for_${userId}`
}

// Mock function to verify a JWT token
const verifyToken = (token: string): string | null => {
  // In a real app, this would decode and verify the JWT
  if (token.startsWith("mock_jwt_token_for_")) {
    return token.replace("mock_jwt_token_for_", "")
  }
  return null
}

// Register a new user
export const registerUser = async (fullName: string, email: string, phone: string, password: string) => {
  // Check if user already exists
  const existingUser = getUserByEmail(email)
  if (existingUser) {
    throw new Error("User already exists")
  }

  // Hash password
  const hashedPassword = hashPassword(password)

  // In a real app, you would store the user in the database with the hashed password
  // For this demo, we're just returning a success message
  return {
    success: true,
    message: "User registered successfully",
  }
}

// Login a user
export const loginUser = async (email: string, password: string) => {
  // Get user by email
  const user = getUserByEmail(email)
  if (!user) {
    throw new Error("Invalid credentials")
  }

  // In a real app, you would verify the password against the stored hash
  // For this demo, we're just simulating a successful login

  // Generate token
  const token = generateToken(user.id)

  // Set cookie
  cookies().set("auth_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: "/",
  })

  return {
    success: true,
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    },
  }
}

// Get the current user
export const getCurrentUser = async () => {
  // Get token from cookie
  const token = cookies().get("auth_token")?.value
  if (!token) {
    return null
  }

  // Verify token
  const userId = verifyToken(token)
  if (!userId) {
    return null
  }

  // In a real app, you would get the user from the database
  // For this demo, we're just returning a mock user
  return {
    id: userId,
    fullName: "John Doe",
    email: "john@example.com",
  }
}

// Logout the current user
export const logoutUser = async () => {
  // Delete cookie
  cookies().delete("auth_token")

  return {
    success: true,
  }
}

