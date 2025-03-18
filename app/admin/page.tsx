"use client"

import { useState } from "react"
import Link from "next/link"
import {
  ArrowUpDown,
  BarChart3,
  Bus,
  CreditCard,
  Download,
  LineChart,
  Menu,
  Search,
  Settings,
  Ticket,
  Users,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

export default function AdminDashboardPage() {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  const recentTransactions = [
    { id: 1, user: "John Doe", type: "Fare Payment", amount: 2.5, date: "Today, 9:30 AM", status: "completed" },
    { id: 2, user: "Sarah Smith", type: "Top Up", amount: 50.0, date: "Today, 8:15 AM", status: "completed" },
    {
      id: 3,
      user: "Michael Brown",
      type: "Ticket Purchase",
      amount: 75.0,
      date: "Yesterday, 3:45 PM",
      status: "completed",
    },
    {
      id: 4,
      user: "Emily Johnson",
      type: "Fare Payment",
      amount: 3.75,
      date: "Yesterday, 1:20 PM",
      status: "completed",
    },
    { id: 5, user: "David Wilson", type: "Top Up", amount: 20.0, date: "Mar 8, 2025", status: "completed" },
  ]

  const recentUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", joined: "Today, 10:30 AM", status: "active" },
    { id: 2, name: "Sarah Smith", email: "sarah@example.com", joined: "Yesterday, 2:15 PM", status: "active" },
    { id: 3, name: "Michael Brown", email: "michael@example.com", joined: "Mar 8, 2025", status: "active" },
    { id: 4, name: "Emily Johnson", email: "emily@example.com", joined: "Mar 7, 2025", status: "pending" },
    { id: 5, name: "David Wilson", email: "david@example.com", joined: "Mar 5, 2025", status: "active" },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72">
            <div className="flex items-center gap-2 pb-4 pt-2">
              <Bus className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold">TransitPay Admin</span>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileNavOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="/admin"
                className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <BarChart3 className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/admin/users"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <Users className="h-5 w-5" />
                Users
              </Link>
              <Link
                href="/admin/transactions"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <CreditCard className="h-5 w-5" />
                Transactions
              </Link>
              <Link
                href="/admin/tickets"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <Ticket className="h-5 w-5" />
                Tickets
              </Link>
              <Link
                href="/admin/analytics"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <LineChart className="h-5 w-5" />
                Analytics
              </Link>
              <Link
                href="/admin/settings"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => setIsMobileNavOpen(false)}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/admin" className="flex items-center gap-2 md:ml-0">
          <Bus className="h-6 w-6 text-primary" />
          <span className="font-bold">TransitPay Admin</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <form className="hidden md:block">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input type="search" placeholder="Search..." className="w-64 pl-8 bg-background" />
            </div>
          </form>
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="Admin" />
            <AvatarFallback>AD</AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium">
                <Link
                  href="/admin"
                  className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 text-primary transition-all"
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/admin/users"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Users className="h-4 w-4" />
                  Users
                </Link>
                <Link
                  href="/admin/transactions"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <CreditCard className="h-4 w-4" />
                  Transactions
                </Link>
                <Link
                  href="/admin/tickets"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Ticket className="h-4 w-4" />
                  Tickets
                </Link>
                <Link
                  href="/admin/analytics"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <LineChart className="h-4 w-4" />
                  Analytics
                </Link>
                <Link
                  href="/admin/settings"
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
              </nav>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="grid gap-4 md:gap-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
              <div className="flex items-center gap-2">
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export Reports
                </Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$12,543.00</div>
                  <p className="text-xs text-muted-foreground">+15% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">2,350</div>
                  <p className="text-xs text-muted-foreground">+180 new users this week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
                  <Ticket className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
                  <p className="text-xs text-muted-foreground">+8% from last week</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Fare Transactions</CardTitle>
                  <Bus className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">5,678</div>
                  <p className="text-xs text-muted-foreground">+12% from last week</p>
                </CardContent>
              </Card>
            </div>
            <Tabs defaultValue="transactions" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="transactions">Recent Transactions</TabsTrigger>
                <TabsTrigger value="users">New Users</TabsTrigger>
              </TabsList>
              <TabsContent value="transactions" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                    <CardDescription>Overview of the latest payment activities across the platform.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>User</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentTransactions.map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell className="font-medium">{transaction.user}</TableCell>
                            <TableCell>{transaction.type}</TableCell>
                            <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                            <TableCell>{transaction.date}</TableCell>
                            <TableCell>
                              <Badge variant="outline" className="capitalize">
                                {transaction.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="users" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>New Users</CardTitle>
                    <CardDescription>Recently registered users on the platform.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[100px]">
                            <div className="flex items-center gap-1">
                              Name
                              <ArrowUpDown className="h-3 w-3" />
                            </div>
                          </TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Joined</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentUsers.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{user.name}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.joined}</TableCell>
                            <TableCell>
                              <Badge variant={user.status === "active" ? "default" : "outline"} className="capitalize">
                                {user.status}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  )
}

