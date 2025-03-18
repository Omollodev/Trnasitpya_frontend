"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowUpRight, Bus, CreditCard, History, Plus, Ticket, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"
import { getWalletBalance, getTickets, getTransactions } from "@/lib/api-client"
import { useToast } from "@/hooks/use-toast"

export default function DashboardPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [walletBalance, setWalletBalance] = useState(0)
  const [activeTickets, setActiveTickets] = useState<any[]>([])
  const [recentTransactions, setRecentTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // Fetch wallet balance
        const walletData = await getWalletBalance()
        setWalletBalance(walletData.wallet.balance)

        // Fetch tickets
        const ticketsData = await getTickets()
        const active = ticketsData.tickets.filter((ticket: any) => ticket.status === "active")
        setActiveTickets(active)

        // Fetch recent transactions
        const transactionsData = await getTransactions()
        // Sort by date (newest first) and take the first 4
        const recent = transactionsData.transactions
          .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 4)
        setRecentTransactions(recent)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        toast({
          title: "Error",
          description: "Failed to load dashboard data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [toast])

  return (
    <div className="flex flex-col gap-4 p-4 md:gap-8 md:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex items-center gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buy Ticket
          </Button>
          <Button variant="outline">
            <Wallet className="mr-2 h-4 w-4" />
            Top Up Wallet
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-5 w-1/3 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 w-1/2 bg-muted rounded mb-2"></div>
                <div className="h-4 w-2/3 bg-muted rounded"></div>
              </CardContent>
              <CardFooter>
                <div className="h-9 w-full bg-muted rounded"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Wallet Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${walletBalance.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">
                {recentTransactions.length > 0 && recentTransactions[0].type === "Top Up"
                  ? `Last top-up: $${recentTransactions[0].amount.toFixed(2)} on ${new Date(recentTransactions[0].date).toLocaleDateString()}`
                  : "No recent top-ups"}
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/wallet" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Funds
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tickets</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeTickets.length}</div>
              <p className="text-xs text-muted-foreground">
                {activeTickets.length > 0
                  ? `${activeTickets[0].type} expires on ${new Date(activeTickets[0].validUntil).toLocaleDateString()}`
                  : "No active tickets"}
              </p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/tickets" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View Tickets
                </Button>
              </Link>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <History className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recentTransactions.length}</div>
              <p className="text-xs text-muted-foreground">Transactions in the last 7 days</p>
            </CardContent>
            <CardFooter>
              <Link href="/dashboard/history" className="w-full">
                <Button variant="outline" size="sm" className="w-full">
                  <ArrowUpRight className="mr-2 h-4 w-4" />
                  View History
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      )}

      <Tabs defaultValue="tickets" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tickets">Active Tickets</TabsTrigger>
          <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
        </TabsList>
        <TabsContent value="tickets" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Your Active Tickets</CardTitle>
              <CardDescription>View and manage your current tickets and passes.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="animate-pulse flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-2">
                        <div className="h-5 w-32 bg-muted rounded"></div>
                        <div className="h-4 w-48 bg-muted rounded"></div>
                      </div>
                      <div className="h-9 w-24 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : activeTickets.length > 0 ? (
                <div className="space-y-4">
                  {activeTickets.map((ticket) => (
                    <div key={ticket.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Ticket className="h-4 w-4 text-primary" />
                          <span className="font-medium">{ticket.type}</span>
                          <Badge variant="outline" className="ml-2">
                            {ticket.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Valid until: {new Date(ticket.validUntil).toLocaleString()}
                        </p>
                      </div>
                      <Link href={`/dashboard/tickets?id=${ticket.id}`}>
                        <Button variant="outline" size="sm">
                          View QR
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Ticket className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No active tickets</h3>
                  <p className="text-sm text-muted-foreground">Purchase a ticket to get started with your journey</p>
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Purchase Ticket
                  </Button>
                </div>
              )}
            </CardContent>
            {activeTickets.length > 0 && (
              <CardFooter>
                <Button className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Purchase New Ticket
                </Button>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
        <TabsContent value="transactions" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>View your recent payment activity and ticket purchases.</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-2">
                        <div className="h-5 w-32 bg-muted rounded"></div>
                        <div className="h-4 w-48 bg-muted rounded"></div>
                      </div>
                      <div className="h-5 w-16 bg-muted rounded"></div>
                    </div>
                  ))}
                </div>
              ) : recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          {transaction.amount > 0 ? (
                            <Wallet className="h-4 w-4 text-green-500" />
                          ) : transaction.type.includes("Ticket") ? (
                            <CreditCard className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Bus className="h-4 w-4 text-primary" />
                          )}
                          <span className="font-medium">{transaction.type}</span>
                          {transaction.route && (
                            <span className="ml-1 text-muted-foreground">({transaction.route})</span>
                          )}
                          {transaction.ticketType && (
                            <span className="ml-1 text-muted-foreground">({transaction.ticketType})</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{new Date(transaction.date).toLocaleString()}</p>
                      </div>
                      <div className={`font-medium ${transaction.amount > 0 ? "text-green-500" : ""}`}>
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <History className="h-8 w-8 text-muted-foreground mb-2" />
                  <h3 className="text-lg font-medium">No transactions yet</h3>
                  <p className="text-sm text-muted-foreground">Your transaction history will appear here</p>
                </div>
              )}
            </CardContent>
            {recentTransactions.length > 0 && (
              <CardFooter>
                <Link href="/dashboard/history" className="w-full">
                  <Button variant="outline" className="w-full">
                    View All Transactions
                  </Button>
                </Link>
              </CardFooter>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}