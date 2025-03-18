"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Bus, CreditCard, History, Home, LogOut, Menu, Settings, Ticket, User, Wallet, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, logout, isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  // Protect dashboard routes
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isLoading, isAuthenticated, router])

  // If still loading or not authenticated, don't render the dashboard
  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

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
              <span className="text-lg font-bold">TransitPay</span>
              <Button variant="ghost" size="icon" className="ml-auto" onClick={() => setIsMobileNavOpen(false)}>
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <nav className="grid gap-2 text-lg font-medium">
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === "/dashboard" ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setIsMobileNavOpen(false)}
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
              <Link
                href="/dashboard/wallet"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === "/dashboard/wallet"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setIsMobileNavOpen(false)}
              >
                <Wallet className="h-5 w-5" />
                My Wallet
              </Link>
              <Link
                href="/dashboard/tickets"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === "/dashboard/tickets"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setIsMobileNavOpen(false)}
              >
                <Ticket className="h-5 w-5" />
                My Tickets
              </Link>
              <Link
                href="/dashboard/history"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === "/dashboard/history"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setIsMobileNavOpen(false)}
              >
                <History className="h-5 w-5" />
                Transaction History
              </Link>
              <Link
                href="/dashboard/payment-methods"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === "/dashboard/payment-methods"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setIsMobileNavOpen(false)}
              >
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </Link>
              <Link
                href="/dashboard/profile"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === "/dashboard/profile"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setIsMobileNavOpen(false)}
              >
                <User className="h-5 w-5" />
                Profile
              </Link>
              <Link
                href="/dashboard/settings"
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                  pathname === "/dashboard/settings"
                    ? "bg-muted text-primary"
                    : "text-muted-foreground hover:text-primary"
                }`}
                onClick={() => setIsMobileNavOpen(false)}
              >
                <Settings className="h-5 w-5" />
                Settings
              </Link>
              <button
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                onClick={() => {
                  setIsMobileNavOpen(false)
                  logout()
                }}
              >
                <LogOut className="h-5 w-5" />
                Logout
              </button>
            </nav>
          </SheetContent>
        </Sheet>
        <Link href="/" className="flex items-center gap-2 md:ml-0">
          <Bus className="h-6 w-6 text-primary" />
          <span className="font-bold">TransitPay</span>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Button variant="outline" size="sm" className="hidden md:flex">
            <Wallet className="mr-2 h-4 w-4" />
            Balance: ${user?.walletBalance || "0.00"}
          </Button>
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt={user?.fullName || "User"} />
            <AvatarFallback>
              {user?.fullName
                ?.split(" ")
                .map((n) => n[0])
                .join("") || "U"}
            </AvatarFallback>
          </Avatar>
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="hidden w-64 border-r bg-muted/40 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex-1 overflow-auto py-2">
              <nav className="grid items-start px-4 text-sm font-medium">
                <Link
                  href="/dashboard"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === "/dashboard" ? "bg-muted text-primary" : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Home className="h-4 w-4" />
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/wallet"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === "/dashboard/wallet"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Wallet className="h-4 w-4" />
                  My Wallet
                </Link>
                <Link
                  href="/dashboard/tickets"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === "/dashboard/tickets"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Ticket className="h-4 w-4" />
                  My Tickets
                </Link>
                <Link
                  href="/dashboard/history"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === "/dashboard/history"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <History className="h-4 w-4" />
                  Transaction History
                </Link>
                <Link
                  href="/dashboard/payment-methods"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === "/dashboard/payment-methods"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  Payment Methods
                </Link>
                <Link
                  href="/dashboard/profile"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === "/dashboard/profile"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                <Link
                  href="/dashboard/settings"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${
                    pathname === "/dashboard/settings"
                      ? "bg-muted text-primary"
                      : "text-muted-foreground hover:text-primary"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <button
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary text-left"
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </nav>
            </div>
          </div>
        </aside>
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  )
}

