"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Camera, Check, Mail, Phone, Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/hooks/useAuth"
import { getUserProfile, updateUserProfile } from "@/lib/api-client"

export default function ProfilePage() {
  const { toast } = useToast()
  const { user } = useAuth()

  // Profile state
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    avatarUrl: "",
  })

  // Load profile data
  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      try {
        // Try to fetch from API
        const data = await getUserProfile()
        setProfile({
          fullName: data.fullName || "",
          email: data.email || "",
          phone: data.phone || "",
          bio: data.bio || "",
          address: data.address || "",
          city: data.city || "",
          state: data.state || "",
          zipCode: data.zipCode || "",
          country: data.country || "",
          avatarUrl: data.avatarUrl || "",
        })
      } catch (error) {
        console.error("Error fetching profile:", error)

        // Fallback to using the basic user data from auth context
        if (user) {
          setProfile({
            fullName: user.fullName || "",
            email: user.email || "",
            phone: user.phone || "",
            bio: "",
            address: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
            avatarUrl: "",
          })
        }

        toast({
          title: "Using local profile data",
          description: "Could not connect to profile service. Some profile data may be unavailable.",
          variant: "warning",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [toast, user])

  // Handle profile update
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      await updateUserProfile(profile)

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      })
    } catch (error: any) {
      console.error("Profile update error:", error)
      toast({
        title: "Update failed",
        description: error.message || "Failed to update profile. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => ({ ...prev, [name]: value }))
  }

  // Get initials for avatar fallback
  const getInitials = () => {
    return (
      profile.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    )
  }

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
        <h1 className="text-2xl font-bold tracking-tight">My Profile</h1>
        <Button form="profile-form" type="submit" disabled={isSaving}>
          <Save className="mr-2 h-4 w-4" />
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-6">
          <Card className="animate-pulse">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-muted"></div>
                <div>
                  <div className="h-6 w-32 bg-muted rounded mb-2"></div>
                  <div className="h-4 w-48 bg-muted rounded"></div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-24 bg-muted rounded"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <form id="profile-form" onSubmit={handleProfileUpdate}>
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="address">Address & Contact</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="mt-4">
              <Card>
                <CardHeader>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <div className="relative">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={profile.avatarUrl} alt={profile.fullName} />
                        <AvatarFallback>{getInitials()}</AvatarFallback>
                      </Avatar>
                      <Button
                        size="icon"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                        type="button"
                      >
                        <Camera className="h-4 w-4" />
                        <span className="sr-only">Change avatar</span>
                      </Button>
                    </div>
                    <div>
                      <CardTitle>{profile.fullName || "Your Name"}</CardTitle>
                      <CardDescription>{profile.email}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={profile.fullName}
                        onChange={handleChange}
                        placeholder="Your full name"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="email">Email Address</Label>
                      <div className="flex">
                        <Input
                          id="email"
                          name="email"
                          value={profile.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          className="rounded-r-none"
                        />
                        <Button type="button" variant="secondary" className="rounded-l-none" disabled>
                          <Check className="mr-2 h-4 w-4" />
                          Verified
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={profile.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profile.bio}
                        onChange={handleChange}
                        placeholder="Tell us a little about yourself"
                        rows={4}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="address" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Address Information</CardTitle>
                  <CardDescription>Update your address and contact details</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="address">Street Address</Label>
                      <Input
                        id="address"
                        name="address"
                        value={profile.address}
                        onChange={handleChange}
                        placeholder="123 Main St"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>
                        <Input id="city" name="city" value={profile.city} onChange={handleChange} placeholder="City" />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="state">State/Province</Label>
                        <Input
                          id="state"
                          name="state"
                          value={profile.state}
                          onChange={handleChange}
                          placeholder="State"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="zipCode">ZIP/Postal Code</Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          value={profile.zipCode}
                          onChange={handleChange}
                          placeholder="ZIP Code"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="country">Country</Label>
                        <Input
                          id="country"
                          name="country"
                          value={profile.country}
                          onChange={handleChange}
                          placeholder="Country"
                        />
                      </div>
                    </div>

                    <div className="grid gap-2 pt-4">
                      <h3 className="text-lg font-medium">Contact Preferences</h3>
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Button type="button" variant="outline" className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email is primary
                        </Button>
                        <Button type="button" variant="outline" className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          Phone is primary
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" type="button">
                    Reset
                  </Button>
                  <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      )}
    </div>
  )
}

