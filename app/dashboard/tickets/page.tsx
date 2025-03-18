"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Bus, Download, QrCode, Ticket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { getTickets } from "@/lib/api-client"

export default function TicketsPage() {
  const { toast } = useToast()
  const searchParams = useSearchParams()
  const ticketId = searchParams.get("id")

  const [activeQrTicket, setActiveQrTicket] = useState<number | null>(ticketId ? Number.parseInt(ticketId) : null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTickets, setActiveTickets] = useState<any[]>([])
  const [expiredTickets, setExpiredTickets] = useState<any[]>([])

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true)
      try {
        const response = await getTickets()

        // Separate active and expired tickets
        const active: any[] = []
        const expired: any[] = []

        response.tickets.forEach((ticket: any) => {
          if (ticket.status === "active") {
            active.push(ticket)
          } else {
            expired.push(ticket)
          }
        })

        setActiveTickets(active)
        setExpiredTickets(expired)

        // If a ticket ID was provided in the URL, open its QR code
        if (ticketId) {
          setActiveQrTicket(Number.parseInt(ticketId))
        }
      } catch (error) {
        console.error("Error fetching tickets:", error)
        toast({
          title: "Error",
          description: "Failed to load tickets. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchTickets()
  }, [ticketId, toast])

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Tickets</h1>
        <Button>
          <Ticket className="mr-2 h-4 w-4" />
          Purchase New Ticket
        </Button>
      </div>

      <Tabs defaultValue="active" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="active">Active Tickets</TabsTrigger>
          <TabsTrigger value="expired">Expired Tickets</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-muted rounded-full"></div>
                        <div className="h-6 w-32 bg-muted rounded"></div>
                      </div>
                      <div className="h-5 w-16 bg-muted rounded-full"></div>
                    </div>
                    <div className="h-4 w-48 bg-muted rounded mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-4 w-24 bg-muted rounded"></div>
                        <div className="h-4 w-32 bg-muted rounded"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-4 w-16 bg-muted rounded"></div>
                        <div className="h-4 w-16 bg-muted rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <div className="h-9 w-32 bg-muted rounded"></div>
                    <div className="h-9 w-32 bg-muted rounded"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : activeTickets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {activeTickets.map((ticket) => (
                <Card key={ticket.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-primary" />
                        <CardTitle>{ticket.type}</CardTitle>
                      </div>
                      <Badge>{ticket.status}</Badge>
                    </div>
                    <CardDescription>Purchased on {new Date(ticket.purchaseDate).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Valid until</span>
                        <span className="font-medium">{new Date(ticket.validUntil).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-medium">${ticket.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Dialog
                      open={activeQrTicket === ticket.id}
                      onOpenChange={(open) => {
                        if (open) {
                          setActiveQrTicket(ticket.id)
                        } else {
                          setActiveQrTicket(null)
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline">
                          <QrCode className="mr-2 h-4 w-4" />
                          Show QR Code
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Ticket QR Code</DialogTitle>
                          <DialogDescription>Show this QR code to the driver or scan at the terminal</DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col items-center justify-center p-4">
                          <div className="bg-white p-4 rounded-lg">
                            <img
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=ticket_${ticket.id}_${ticket.type.replace(/\s+/g, "_").toLowerCase()}`}
                              alt="QR Code"
                              className="w-48 h-48 object-contain"
                            />
                          </div>
                          <div className="mt-4 text-center">
                            <h3 className="font-semibold">{ticket.type}</h3>
                            <p className="text-sm text-muted-foreground">
                              Valid until: {new Date(ticket.validUntil).toLocaleString()}
                            </p>
                          </div>
                          <Button variant="outline" className="mt-4">
                            <Download className="mr-2 h-4 w-4" />
                            Save to device
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Button variant="secondary">
                      <Bus className="mr-2 h-4 w-4" />
                      Use Ticket
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Active Tickets</h2>
              <p className="text-muted-foreground mb-6 max-w-md">
                You don't have any active tickets. Purchase a ticket to start your journey.
              </p>
              <Button>
                <Ticket className="mr-2 h-4 w-4" />
                Purchase New Ticket
              </Button>
            </div>
          )}
        </TabsContent>
        <TabsContent value="expired" className="mt-4">
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse opacity-80">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-5 w-5 bg-muted rounded-full"></div>
                        <div className="h-6 w-32 bg-muted rounded"></div>
                      </div>
                      <div className="h-5 w-16 bg-muted rounded-full"></div>
                    </div>
                    <div className="h-4 w-48 bg-muted rounded mt-2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-4 w-24 bg-muted rounded"></div>
                        <div className="h-4 w-32 bg-muted rounded"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-4 w-16 bg-muted rounded"></div>
                        <div className="h-4 w-16 bg-muted rounded"></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="h-9 w-full bg-muted rounded"></div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : expiredTickets.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {expiredTickets.map((ticket) => (
                <Card key={ticket.id} className="opacity-80">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ticket className="h-5 w-5 text-muted-foreground" />
                        <CardTitle className="text-muted-foreground">{ticket.type}</CardTitle>
                      </div>
                      <Badge variant="outline">{ticket.status}</Badge>
                    </div>
                    <CardDescription>Purchased on {new Date(ticket.purchaseDate).toLocaleString()}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Valid until</span>
                        <span className="font-medium text-muted-foreground">
                          {new Date(ticket.validUntil).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Price</span>
                        <span className="font-medium text-muted-foreground">${ticket.price.toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" disabled>
                      <QrCode className="mr-2 h-4 w-4" />
                      Ticket Expired
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Ticket className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">No Expired Tickets</h2>
              <p className="text-muted-foreground mb-6 max-w-md">You don't have any expired tickets in your history.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

