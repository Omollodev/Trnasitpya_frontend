"use client"

import { useState, useEffect } from "react"
import { BanknoteIcon as Bank, CreditCard, Plus, Smartphone, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { getPaymentMethods, addPaymentMethod } from "@/lib/api-client"

export default function PaymentMethodsPage() {
  const { toast } = useToast()
  const [isAddingCard, setIsAddingCard] = useState(false)
  const [isAddingMobile, setIsAddingMobile] = useState(false)
  const [isAddingBank, setIsAddingBank] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])

  // Card form state
  const [cardForm, setCardForm] = useState({
    cardName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvc: "",
  })

  // Mobile money form state
  const [mobileForm, setMobileForm] = useState({
    provider: "",
    phoneNumber: "",
  })

  // Bank account form state
  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountName: "",
    accountNumber: "",
    routingNumber: "",
  })

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      setIsLoading(true)
      try {
        const response = await getPaymentMethods()
        setPaymentMethods(response.paymentMethods)
      } catch (error) {
        console.error("Error fetching payment methods:", error)
        toast({
          title: "Error",
          description: "Failed to load payment methods. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPaymentMethods()
  }, [toast])

  const handleAddCard = async () => {
    try {
      setIsLoading(true)

      // Validate form
      if (
        !cardForm.cardName ||
        !cardForm.cardNumber ||
        !cardForm.expiryMonth ||
        !cardForm.expiryYear ||
        !cardForm.cvc
      ) {
        throw new Error("Please fill in all card details")
      }

      const response = await addPaymentMethod({
        type: "card",
        details: {
          brand: getCardBrand(cardForm.cardNumber),
          last4: cardForm.cardNumber.slice(-4),
          expiryMonth: cardForm.expiryMonth,
          expiryYear: cardForm.expiryYear,
          isDefault: paymentMethods.length === 0, // Make default if it's the first payment method
        },
      })

      // Add the new payment method to the list
      setPaymentMethods((prev) => [...prev, response.paymentMethod])

      // Reset form and close dialog
      setCardForm({
        cardName: "",
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvc: "",
      })
      setIsAddingCard(false)

      toast({
        title: "Card added",
        description: "Your card has been added successfully.",
      })
    } catch (error: any) {
      console.error("Error adding card:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddMobile = async () => {
    try {
      setIsLoading(true)

      // Validate form
      if (!mobileForm.provider || !mobileForm.phoneNumber) {
        throw new Error("Please fill in all mobile money details")
      }

      const response = await addPaymentMethod({
        type: "mobile",
        details: {
          provider: mobileForm.provider,
          phoneNumber: mobileForm.phoneNumber,
          isDefault: paymentMethods.length === 0, // Make default if it's the first payment method
        },
      })

      // Add the new payment method to the list
      setPaymentMethods((prev) => [...prev, response.paymentMethod])

      // Reset form and close dialog
      setMobileForm({
        provider: "",
        phoneNumber: "",
      })
      setIsAddingMobile(false)

      toast({
        title: "Mobile money added",
        description: "Your mobile money account has been added successfully.",
      })
    } catch (error: any) {
      console.error("Error adding mobile money:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add mobile money. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddBank = async () => {
    try {
      setIsLoading(true)

      // Validate form
      if (!bankForm.bankName || !bankForm.accountName || !bankForm.accountNumber || !bankForm.routingNumber) {
        throw new Error("Please fill in all bank account details")
      }

      const response = await addPaymentMethod({
        type: "bank",
        details: {
          bankName: bankForm.bankName,
          accountName: bankForm.accountName,
          accountNumber: bankForm.accountNumber,
          routingNumber: bankForm.routingNumber,
          isDefault: paymentMethods.length === 0, // Make default if it's the first payment method
        },
      })

      // Add the new payment method to the list
      setPaymentMethods((prev) => [...prev, response.paymentMethod])

      // Reset form and close dialog
      setBankForm({
        bankName: "",
        accountName: "",
        accountNumber: "",
        routingNumber: "",
      })
      setIsAddingBank(false)

      toast({
        title: "Bank account added",
        description: "Your bank account has been added successfully.",
      })
    } catch (error: any) {
      console.error("Error adding bank account:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to add bank account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to determine card brand from number
  const getCardBrand = (cardNumber: string) => {
    // Very simplified card brand detection
    if (cardNumber.startsWith("4")) return "Visa"
    if (cardNumber.startsWith("5")) return "Mastercard"
    if (cardNumber.startsWith("3")) return "Amex"
    if (cardNumber.startsWith("6")) return "Discover"
    return "Card"
  }

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Payment Methods</h1>
        <div className="flex flex-wrap gap-2">
          <Dialog open={isAddingCard} onOpenChange={setIsAddingCard}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <CreditCard className="mr-2 h-4 w-4" />
                Add Card
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Credit/Debit Card</DialogTitle>
                <DialogDescription>Add a new card to your account for payments and top-ups</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="cardName">Name on Card</Label>
                  <Input
                    id="cardName"
                    placeholder="John Doe"
                    value={cardForm.cardName}
                    onChange={(e) => setCardForm((prev) => ({ ...prev, cardName: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    value={cardForm.cardNumber}
                    onChange={(e) => setCardForm((prev) => ({ ...prev, cardNumber: e.target.value }))}
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="expiryMonth">Expiry Month</Label>
                    <Select
                      value={cardForm.expiryMonth}
                      onValueChange={(value) => setCardForm((prev) => ({ ...prev, expiryMonth: value }))}
                    >
                      <SelectTrigger id="expiryMonth">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <SelectItem key={month} value={month.toString().padStart(2, "0")}>
                            {month.toString().padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="expiryYear">Expiry Year</Label>
                    <Select
                      value={cardForm.expiryYear}
                      onValueChange={(value) => setCardForm((prev) => ({ ...prev, expiryYear: value }))}
                    >
                      <SelectTrigger id="expiryYear">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map((year) => (
                          <SelectItem key={year} value={year.toString()}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="cvc">CVC</Label>
                    <Input
                      id="cvc"
                      placeholder="123"
                      maxLength={3}
                      value={cardForm.cvc}
                      onChange={(e) => setCardForm((prev) => ({ ...prev, cvc: e.target.value }))}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddCard} disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Card"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingMobile} onOpenChange={setIsAddingMobile}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Smartphone className="mr-2 h-4 w-4" />
                Add Mobile Money
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Mobile Money</DialogTitle>
                <DialogDescription>Link your mobile money account for payments</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="provider">Provider</Label>
                  <Select
                    value={mobileForm.provider}
                    onValueChange={(value) => setMobileForm((prev) => ({ ...prev, provider: value }))}
                  >
                    <SelectTrigger id="provider">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mtn">MTN Mobile Money</SelectItem>
                      <SelectItem value="airtel">Airtel Money</SelectItem>
                      <SelectItem value="vodafone">Vodafone Cash</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    placeholder="+1 (555) 000-0000"
                    value={mobileForm.phoneNumber}
                    onChange={(e) => setMobileForm((prev) => ({ ...prev, phoneNumber: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddMobile} disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Mobile Money"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddingBank} onOpenChange={setIsAddingBank}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Bank className="mr-2 h-4 w-4" />
                Add Bank Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Bank Account</DialogTitle>
                <DialogDescription>Link your bank account for direct transfers</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="bankName">Bank Name</Label>
                  <Select
                    value={bankForm.bankName}
                    onValueChange={(value) => setBankForm((prev) => ({ ...prev, bankName: value }))}
                  >
                    <SelectTrigger id="bankName">
                      <SelectValue placeholder="Select bank" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="chase">Chase Bank</SelectItem>
                      <SelectItem value="bofa">Bank of America</SelectItem>
                      <SelectItem value="wells">Wells Fargo</SelectItem>
                      <SelectItem value="citi">Citibank</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="accountName">Account Holder Name</Label>
                  <Input
                    id="accountName"
                    placeholder="John Doe"
                    value={bankForm.accountName}
                    onChange={(e) => setBankForm((prev) => ({ ...prev, accountName: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="accountNumber">Account Number</Label>
                  <Input
                    id="accountNumber"
                    placeholder="000000000"
                    value={bankForm.accountNumber}
                    onChange={(e) => setBankForm((prev) => ({ ...prev, accountNumber: e.target.value }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="routingNumber">Routing Number</Label>
                  <Input
                    id="routingNumber"
                    placeholder="000000000"
                    value={bankForm.routingNumber}
                    onChange={(e) => setBankForm((prev) => ({ ...prev, routingNumber: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleAddBank} disabled={isLoading}>
                  {isLoading ? "Adding..." : "Add Bank Account"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid gap-6">
        <Alert>
          <CreditCard className="h-4 w-4" />
          <AlertTitle>Secure Payment Processing</AlertTitle>
          <AlertDescription>
            Your payment information is securely stored and processed. We never store your full card details on our
            servers.
          </AlertDescription>
        </Alert>

        <div className="grid gap-4">
          {isLoading ? (
            Array(2)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 rounded-full bg-muted"></div>
                        <div className="h-6 w-32 rounded bg-muted"></div>
                      </div>
                      <div className="h-5 w-20 rounded-full bg-muted"></div>
                    </div>
                    <div className="mt-2 h-4 w-48 rounded bg-muted"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 w-full rounded bg-muted"></div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="h-9 w-32 rounded bg-muted"></div>
                    <div className="h-9 w-32 rounded bg-muted"></div>
                  </CardFooter>
                </Card>
              ))
          ) : paymentMethods.length > 0 ? (
            paymentMethods.map((method) => (
              <Card key={method.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {method.type === "card" ? (
                        <CreditCard className="h-5 w-5 text-primary" />
                      ) : method.type === "mobile" ? (
                        <Smartphone className="h-5 w-5 text-primary" />
                      ) : (
                        <Bank className="h-5 w-5 text-primary" />
                      )}
                      <CardTitle>{method.name}</CardTitle>
                    </div>
                    {method.isDefault && (
                      <div className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        Default
                      </div>
                    )}
                  </div>
                  <CardDescription>
                    {method.type === "card"
                      ? `Expires: ${method.expiryDate}`
                      : method.type === "mobile"
                        ? `Phone: ${method.phoneNumber}`
                        : "Bank Account"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    {method.type === "card"
                      ? "Used for wallet top-ups and ticket purchases"
                      : method.type === "mobile"
                        ? "Used for mobile money transfers"
                        : "Used for direct bank transfers"}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" size="sm">
                    {method.isDefault ? "Default" : "Set as Default"}
                  </Button>
                  <Button variant="outline" size="sm" className="text-destructive">
                    <Trash className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CreditCard className="mb-4 h-12 w-12 text-muted-foreground" />
              <h2 className="mb-2 text-xl font-semibold">No Payment Methods</h2>
              <p className="mb-6 max-w-md text-muted-foreground">
                You haven't added any payment methods yet. Add a payment method to make transactions easier.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="outline" onClick={() => setIsAddingCard(true)}>
                  <CreditCard className="mr-2 h-4 w-4" />
                  Add Card
                </Button>
                <Button variant="outline" onClick={() => setIsAddingMobile(true)}>
                  <Smartphone className="mr-2 h-4 w-4" />
                  Add Mobile Money
                </Button>
                <Button variant="outline" onClick={() => setIsAddingBank(true)}>
                  <Bank className="mr-2 h-4 w-4" />
                  Add Bank Account
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-4">
          <Button variant="outline" className="w-full" onClick={() => setIsAddingCard(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Payment Method
          </Button>
        </div>
      </div>
    </div>
  )
}

