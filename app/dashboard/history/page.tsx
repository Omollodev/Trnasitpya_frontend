"use client"

import { useState, useEffect } from "react"
import { ArrowDown, Bus, Calendar, CreditCard, Download, Filter, Search, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { getTransactions } from "@/lib/api-client"

export default function HistoryPage() {
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [dateRange, setDateRange] = useState("all")
  const [isLoading, setIsLoading] = useState(true)
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      try {
        const response = await getTransactions()
        setTransactions(response.transactions)
      } catch (error) {
        console.error("Error fetching transactions:", error)
        toast({
          title: "Error",
          description: "Failed to load transaction history. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [toast])

  // Filter transactions based on search, type, and date range
  const filteredTransactions = transactions.filter((transaction) => {
    // Search filter
    if (searchQuery && !transaction.type.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Type filter
    if (filterType !== "all") {
      if (filterType === "topup" && !transaction.type.includes("Top Up")) return false
      if (filterType === "fare" && !transaction.type.includes("Fare")) return false
      if (filterType === "ticket" && !transaction.type.includes("Ticket")) return false
      if (filterType === "refund" && !transaction.type.includes("Refund")) return false
    }

    // Date range filter
    if (dateRange !== "all") {
      const today = new Date()
      const transactionDate = new Date(transaction.date)

      if (dateRange === "today" && transactionDate.toDateString() !== today.toDateString()) return false
      if (dateRange === "week") {
        const weekAgo = new Date()
        weekAgo.setDate(today.getDate() - 7)
        if (transactionDate < weekAgo) return false
      }
      if (dateRange === "month") {
        const monthAgo = new Date()
        monthAgo.setMonth(today.getMonth() - 1)
        if (transactionDate < monthAgo) return false
      }
    }

    return true
  })

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Transaction History</h1>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Transactions</CardTitle>
          <CardDescription>Search and filter your transaction history</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search transactions"
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    <SelectValue placeholder="Transaction Type" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="topup">Top Up</SelectItem>
                  <SelectItem value="fare">Fare Payment</SelectItem>
                  <SelectItem value="ticket">Ticket Purchase</SelectItem>
                  <SelectItem value="refund">Refund</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <SelectValue placeholder="Date Range" />
                  </div>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">Last 7 Days</SelectItem>
                  <SelectItem value="month">Last 30 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("")
                setFilterType("all")
                setDateRange("all")
              }}
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="topups">Top Ups</TabsTrigger>
          <TabsTrigger value="fares">Fare Payments</TabsTrigger>
          <TabsTrigger value="tickets">Ticket Purchases</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>
                {isLoading
                  ? "Loading transactions..."
                  : `Showing ${filteredTransactions.length} of ${transactions.length} transactions`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-4 animate-pulse">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full p-2 bg-muted h-8 w-8"></div>
                          <div>
                            <div className="h-5 w-32 bg-muted rounded mb-1"></div>
                            <div className="h-4 w-24 bg-muted rounded mb-1"></div>
                            <div className="h-3 w-20 bg-muted rounded"></div>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <div className="h-5 w-16 bg-muted rounded"></div>
                          <div className="h-5 w-16 bg-muted rounded"></div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : filteredTransactions.length > 0 ? (
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="flex items-start gap-3">
                        <div
                          className={`rounded-full p-2 ${
                            transaction.amount > 0
                              ? "bg-green-100"
                              : transaction.type.includes("Ticket")
                                ? "bg-blue-100"
                                : "bg-primary/10"
                          }`}
                        >
                          {transaction.amount > 0 && !transaction.type.includes("Refund") ? (
                            <ArrowDown className="h-4 w-4 text-green-600" />
                          ) : transaction.type.includes("Ticket") ? (
                            <CreditCard className="h-4 w-4 text-blue-600" />
                          ) : transaction.type.includes("Refund") ? (
                            <Wallet className="h-4 w-4 text-green-600" />
                          ) : (
                            <Bus className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium">
                            {transaction.type}
                            {transaction.route && (
                              <span className="ml-1 text-muted-foreground">({transaction.route})</span>
                            )}
                            {transaction.ticketType && (
                              <span className="ml-1 text-muted-foreground">({transaction.ticketType})</span>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(transaction.date).toLocaleString()}
                          </div>
                          <div className="text-xs text-muted-foreground">Method: {transaction.method}</div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1">
                        <div className={`font-medium ${transaction.amount > 0 ? "text-green-600" : ""}`}>
                          {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Search className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No transactions found</h3>
                  <p className="text-sm text-muted-foreground">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="topups" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Ups</CardTitle>
              <CardDescription>Your wallet top-up history</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-4 animate-pulse">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full p-2 bg-muted h-8 w-8"></div>
                          <div>
                            <div className="h-5 w-32 bg-muted rounded mb-1"></div>
                            <div className="h-4 w-24 bg-muted rounded mb-1"></div>
                            <div className="h-3 w-20 bg-muted rounded"></div>
                          </div>
                        </div>
                        <div className="h-5 w-16 bg-muted rounded"></div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions
                    .filter((t) => t.type === "Top Up")
                    .map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full p-2 bg-green-100">
                            <ArrowDown className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium">{transaction.type}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">Method: {transaction.method}</div>
                          </div>
                        </div>
                        <div className="font-medium text-green-600">+${transaction.amount.toFixed(2)}</div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="fares" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Fare Payments</CardTitle>
              <CardDescription>Your transit fare payment history</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-4 animate-pulse">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full p-2 bg-muted h-8 w-8"></div>
                          <div>
                            <div className="h-5 w-32 bg-muted rounded mb-1"></div>
                            <div className="h-4 w-24 bg-muted rounded mb-1"></div>
                            <div className="h-3 w-20 bg-muted rounded"></div>
                          </div>
                        </div>
                        <div className="h-5 w-16 bg-muted rounded"></div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions
                    .filter((t) => t.type === "Fare Payment")
                    .map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full p-2 bg-primary/10">
                            <Bus className="h-4 w-4 text-primary" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {transaction.type}
                              {transaction.route && (
                                <span className="ml-1 text-muted-foreground">({transaction.route})</span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">Method: {transaction.method}</div>
                          </div>
                        </div>
                        <div className="font-medium">${Math.abs(transaction.amount).toFixed(2)}</div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="tickets" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Purchases</CardTitle>
              <CardDescription>Your ticket purchase history</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {Array(3)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg border p-4 animate-pulse">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full p-2 bg-muted h-8 w-8"></div>
                          <div>
                            <div className="h-5 w-32 bg-muted rounded mb-1"></div>
                            <div className="h-4 w-24 bg-muted rounded mb-1"></div>
                            <div className="h-3 w-20 bg-muted rounded"></div>
                          </div>
                        </div>
                        <div className="h-5 w-16 bg-muted rounded"></div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {transactions
                    .filter((t) => t.type === "Ticket Purchase")
                    .map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                        <div className="flex items-start gap-3">
                          <div className="rounded-full p-2 bg-blue-100">
                            <CreditCard className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="font-medium">
                              {transaction.type}
                              {transaction.ticketType && (
                                <span className="ml-1 text-muted-foreground">({transaction.ticketType})</span>
                              )}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleString()}
                            </div>
                            <div className="text-xs text-muted-foreground">Method: {transaction.method}</div>
                          </div>
                        </div>
                        <div className="font-medium">${Math.abs(transaction.amount).toFixed(2)}</div>
                      </div>
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

