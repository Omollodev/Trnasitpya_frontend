"use client"

import { useState, useEffect } from "react"
import { ArrowDown, ArrowUp, CreditCard, Plus, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { getWalletBalance, getTransactions, topUpWallet, getPaymentMethods } from "@/lib/api-client"

export default function WalletPage() {
  const { toast } = useToast()
  const [topUpAmount, setTopUpAmount] = useState("50")
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isTopUpDialogOpen, setIsTopUpDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isDataLoading, setIsDataLoading] = useState(true)
  const [walletBalance, setWalletBalance] = useState(0)
  const [transactions, setTransactions] = useState<any[]>([])
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])

  useEffect(() => {
    const fetchWalletData = async () => {
      setIsDataLoading(true)
      try {
        // Fetch wallet balance
        const walletData = await getWalletBalance()
        setWalletBalance(walletData.wallet.balance)

        // Fetch transactions
        const transactionsData = await getTransactions()
        setTransactions(transactionsData.transactions)

        // Fetch payment methods
        const paymentMethodsData = await getPaymentMethods()
        setPaymentMethods(paymentMethodsData.paymentMethods)
      } catch (error) {
        console.error("Error fetching wallet data:", error)
        toast({
          title: "Error",
          description: "Failed to load wallet data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDataLoading(false)
      }
    }

    fetchWalletData()
  }, [toast])

  const handleTopUp = async () => {
    setIsLoading(true)
    try {
      const response = await topUpWallet({
        amount: Number.parseFloat(topUpAmount),
        paymentMethod,
      })

      // Update wallet balance
      setWalletBalance(response.wallet.balance)

      // Add new transaction to the list
      setTransactions((prev) => [response.transaction, ...prev])

      setIsTopUpDialogOpen(false)

      toast({
        title: "Top-up successful",
        description: `$${topUpAmount} has been added to your wallet.`,
      })
    } catch (error) {
      console.error("Top-up error:", error)
      toast({
        title: "Top-up failed",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Wallet</h1>
        <Dialog open={isTopUpDialogOpen} onOpenChange={setIsTopUpDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Top Up Wallet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Top Up Your Wallet</DialogTitle>
              <DialogDescription>Add funds to your wallet for seamless payments</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount</Label>
                <div className="flex items-center">
                  <span className="mr-2 text-lg font-medium">$</span>
                  <Input
                    id="amount"
                    type="number"
                    value={topUpAmount}
                    onChange={(e) => setTopUpAmount(e.target.value)}
                    min="5"
                    step="5"
                    className="text-lg"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Payment Method</Label>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  {paymentMethods.length > 0 ? (
                    paymentMethods.map((method) => (
                      <div key={method.id} className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value={method.id.toString()} id={`method-${method.id}`} />
                        <Label htmlFor={`method-${method.id}`} className="flex items-center gap-2 font-normal">
                          {method.type === "card" ? (
                            <CreditCard className="h-4 w-4" />
                          ) : method.type === "mobile" ? (
                            <Wallet className="h-4 w-4" />
                          ) : (
                            <ArrowUp className="h-4 w-4" />
                          )}
                          {method.name}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="flex items-center gap-2 font-normal">
                          <CreditCard className="h-4 w-4" />
                          Credit/Debit Card
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="mobile" id="mobile" />
                        <Label htmlFor="mobile" className="flex items-center gap-2 font-normal">
                          <Wallet className="h-4 w-4" />
                          Mobile Money
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 rounded-md border p-3">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="flex items-center gap-2 font-normal">
                          <ArrowUp className="h-4 w-4" />
                          Bank Transfer
                        </Label>
                      </div>
                    </>
                  )}
                </RadioGroup>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleTopUp} disabled={isLoading}>
                {isLoading ? "Processing..." : "Top Up Now"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Wallet Balance</CardTitle>
            <CardDescription>Your current available funds</CardDescription>
          </CardHeader>
          <CardContent>
            {isDataLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="animate-pulse">
                  <div className="h-10 w-32 bg-muted rounded mb-2 mx-auto"></div>
                  <div className="h-4 w-48 bg-muted rounded mx-auto"></div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center py-6">
                <div className="text-center">
                  <div className="text-4xl font-bold">${walletBalance.toFixed(2)}</div>
                  <p className="text-sm text-muted-foreground mt-1">Last updated: {new Date().toLocaleString()}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={() => setIsTopUpDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Funds
            </Button>
          </CardFooter>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>Recent wallet activities</CardDescription>
          </CardHeader>
          <CardContent>
            {isDataLoading ? (
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
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
            ) : transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`rounded-full p-2 ${transaction.amount > 0 ? "bg-green-100" : "bg-primary/10"}`}>
                        {transaction.amount > 0 ? (
                          <ArrowDown className="h-4 w-4 text-green-600" />
                        ) : (
                          <ArrowUp className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium">{transaction.type}</div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(transaction.date).toLocaleString()}
                        </div>
                        <div className="text-xs text-muted-foreground">{transaction.method}</div>
                      </div>
                    </div>
                    <div className={`font-medium ${transaction.amount > 0 ? "text-green-600" : ""}`}>
                      {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <Wallet className="h-8 w-8 text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium">No transactions yet</h3>
                <p className="text-sm text-muted-foreground">
                  Your transaction history will appear here once you start using your wallet
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full">
              View All Transactions
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

