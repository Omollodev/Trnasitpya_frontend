import Link from "next/link"
import { ArrowRight, Bus, CreditCard, Shield, Smartphone, Ticket } from "lucide-react"
import Image from "next/image"

import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-r from-primary/90 to-primary">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="flex flex-col justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                  Modern Fare Collection for Modern Transit
                </h1>
                <p className="max-w-[600px] text-white/90 md:text-xl">
                  Seamless, secure, and efficient online payment platform for public transportation. Pay for your rides
                  anytime, anywhere.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-black/40 to-black/10 z-10"></div>
                <img
                  src="/img/scanme.png?height=400width=400"
                  alt="QR Code Payment"
                  className="object-cover w-full h-full"
                />
               
                <div className="absolute bottom-4 left-4 z-20 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
                  <div className="flex items-center space-x-2">
                    <Ticket className="h-5 w-5 text-primary" />
                    <span className="font-medium text-sm">Scan. Pay. Go.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    
      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-background">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simplifying Transit Payments</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our fare collection system offers a range of features designed to make public transportation payments
                easier and more efficient.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 mt-12">
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Smartphone className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Mobile Friendly</h3>
              <p className="text-center text-muted-foreground">
                Access your account, purchase tickets, and manage your travel from any device.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Multiple Payment Options</h3>
              <p className="text-center text-muted-foreground">
                Pay with credit/debit cards, mobile wallets, or digital banking services.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Ticket className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">QR Ticketing</h3>
              <p className="text-center text-muted-foreground">
                Generate digital tickets with QR codes for quick and easy validation.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Secure Transactions</h3>
              <p className="text-center text-muted-foreground">
                End-to-end encryption and PCI compliance for safe and secure payments.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <Bus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Real-Time Updates</h3>
              <p className="text-center text-muted-foreground">
                Get instant confirmation and real-time updates on your transactions.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-4 rounded-lg border p-6 shadow-sm">
              <div className="rounded-full bg-primary/10 p-3">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Wallet System</h3>
              <p className="text-center text-muted-foreground">
                Load your wallet for faster payments and special discounts for frequent travelers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Ready to Simplify Your Transit Payments?
              </h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Join thousands of commuters who have already made the switch to our digital fare collection system.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg">Create an Account</Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  Contact Sales
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

