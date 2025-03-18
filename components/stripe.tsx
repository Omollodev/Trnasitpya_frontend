"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

// Initialize Stripe with a public key
// In a real app, you would use your actual Stripe publishable key
const stripePromise = loadStripe("pk_test_sample_key")

interface StripeProps {
  options: {
    mode: "payment" | "subscription"
    amount: number
    currency: string
  }
  className?: string
  children: React.ReactNode
}

export function Stripe({ options, className, children }: StripeProps) {
  const [clientSecret, setClientSecret] = useState<string>("")

  useEffect(() => {
    // In a real app, you would fetch the client secret from your server
    // This is just a simulation for the demo
    const simulateClientSecretFetch = async () => {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Simulate a client secret
      setClientSecret("seti_sample_client_secret_simulation")
    }

    simulateClientSecretFetch()
  }, [options])

  return (
    <div className={className}>
      {clientSecret ? (
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
            },
          }}
        >
          {children}
        </Elements>
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  )
}

