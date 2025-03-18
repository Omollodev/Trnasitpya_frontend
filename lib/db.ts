interface User {
  id: string
  fullName: string
  email: string
  phone: string
  walletBalance: number
  createdAt: string
}

interface Transaction {
  id: string
  userId: string
  type: string
  amount: number
  date: string
  method: string
  status: string
  route?: string
  ticketType?: string
}

interface Ticket {
  id: string
  userId: string
  type: string
  validUntil: string
  status: string
  purchaseDate: string
  price: number
}

interface PaymentMethod {
  id: string
  userId: string
  type: string
  name: string
  isDefault: boolean
  expiryDate?: string
  phoneNumber?: string
}

// Mock data storage
const users: User[] = []
const transactions: Transaction[] = []
const tickets: Ticket[] = []
const paymentMethods: PaymentMethod[] = []

// User methods
export const createUser = (userData: Omit<User, "id" | "walletBalance" | "createdAt">) => {
  const newUser: User = {
    id: Math.random().toString(36).substring(2, 15),
    ...userData,
    walletBalance: 0,
    createdAt: new Date().toISOString(),
  }

  users.push(newUser)
  return newUser
}

export const getUserByEmail = (email: string) => {
  return users.find((user) => user.email === email)
}

export const getUserById = (id: string) => {
  return users.find((user) => user.id === id)
}

export const updateUserWalletBalance = (userId: string, amount: number) => {
  const user = getUserById(userId)
  if (user) {
    user.walletBalance += amount
    return user
  }
  return null
}

// Transaction methods
export const createTransaction = (transactionData: Omit<Transaction, "id" | "date">) => {
  const newTransaction: Transaction = {
    id: Math.random().toString(36).substring(2, 15),
    ...transactionData,
    date: new Date().toISOString(),
  }

  transactions.push(newTransaction)
  return newTransaction
}

export const getTransactionsByUserId = (userId: string) => {
  return transactions.filter((transaction) => transaction.userId === userId)
}

// Ticket methods
export const createTicket = (ticketData: Omit<Ticket, "id" | "purchaseDate">) => {
  const newTicket: Ticket = {
    id: Math.random().toString(36).substring(2, 15),
    ...ticketData,
    purchaseDate: new Date().toISOString(),
  }

  tickets.push(newTicket)
  return newTicket
}

export const getTicketsByUserId = (userId: string) => {
  return tickets.filter((ticket) => ticket.userId === userId)
}

export const getActiveTicketsByUserId = (userId: string) => {
  return tickets.filter((ticket) => ticket.userId === userId && ticket.status === "active")
}

// Payment method methods
export const createPaymentMethod = (paymentMethodData: Omit<PaymentMethod, "id">) => {
  const newPaymentMethod: PaymentMethod = {
    id: Math.random().toString(36).substring(2, 15),
    ...paymentMethodData,
  }

  paymentMethods.push(newPaymentMethod)
  return newPaymentMethod
}

export const getPaymentMethodsByUserId = (userId: string) => {
  return paymentMethods.filter((paymentMethod) => paymentMethod.userId === userId)
}

export const getDefaultPaymentMethod = (userId: string) => {
  return paymentMethods.find((paymentMethod) => paymentMethod.userId === userId && paymentMethod.isDefault)
}

