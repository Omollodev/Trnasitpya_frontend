"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { User, Users, ShoppingBag, Settings, Bus, Wallet, FileText, CreditCard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated, isAdmin, isLoading } = useAuth()

  // Redirect non-admin users to regular dashboard
  useEffect(() => {
    if (!isLoading && isAuthenticated && !isAdmin) {
      router.push('/dashboard')
    }
    
    if (!isLoading && !isAuthenticated) {
      router.push('/login')
    }
  }, [isLoading, isAuthenticated, isAdmin, router])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect in useEffect
  }

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => router.push('/admin/settings')}>
            <Settings className="mr-2 h-4 w-4" />
            Admin Settings
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage system users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">157</div>
            <p className="text-sm text-muted-foreground">Total registered users</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push('/admin/users')}>
              <Users className="mr-2 h-4 w-4" />
              Manage Users
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Tickets</CardTitle>
            <CardDescription>Manage transit tickets</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">2,453</div>
            <p className="text-sm text-muted-foreground">Tickets sold this month</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push('/admin/tickets')}>
              <Bus className="mr-2 h-4 w-4" />
              Manage Tickets
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Transactions</CardTitle>
            <CardDescription>Manage payment transactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">$24,789</div>
            <p className="text-sm text-muted-foreground">Total revenue this month</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push('/admin/transactions')}>
              <CreditCard className="mr-2 h-4 w-4" />
              View Transactions
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Reports</CardTitle>
            <CardDescription>View system reports</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-lg font-semibold">Daily</div>
                <p className="text-sm text-muted-foreground">$1,245</p>
              </div>
              <div>
                <div className="text-lg font-semibold">Monthly</div>
                <p className="text-sm text-muted-foreground">$24,789</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push('/admin/reports')}>
              <FileText className="mr-2 h-4 w-4" />
              View Reports
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Manage available payment methods</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">4</div>
            <p className="text-sm text-muted-foreground">Active payment methods</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push('/admin/payment-methods')}>
              <Wallet className="mr-2 h-4 w-4" />
              Configure Payments
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>User Profile</CardTitle>
            <CardDescription>Your admin account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-medium">{user?.name || user?.email}</div>
            <p className="text-sm text-muted-foreground">Administrator</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => router.push('/admin/profile')}>
              <User className="mr-2 h-4 w-4" />
              Manage Profile
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 