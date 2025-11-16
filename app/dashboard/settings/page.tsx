"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useRouter } from 'next/navigation'
import Link from "next/link"
import { ArrowLeft, Shield, CreditCard, User, Mail, Lock, Check } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient()
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        router.push("/auth/login")
        return
      }

      const { data: profile } = await supabase.from("profiles").select("*").eq("id", authUser.id).single()

      const { data: activeSessions } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: false })

      setUser(authUser)
      if (profile) {
        setFullName(profile.full_name || "")
        setUsername(profile.username || "")
      }
      setSessions(activeSessions || [])
      setLoading(false)
    }

    loadProfile()
  }, [router])

  const handleSave = async () => {
    if (!user) return

    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: fullName,
          username: username,
        })
        .eq("id", user.id)

      if (error) throw error

      toast({
        title: "Settings saved",
        description: "Your profile has been updated successfully.",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        title: "Error",
        description: "Failed to save settings. Please try again.",
        variant: "destructive"
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="h-4 w-4 rounded-full bg-primary animate-pulse"></div>
        <span>Loading settings...</span>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Account Settings</h1>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <Input value={user?.email} disabled className="flex-1" />
                  <Check className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-xs text-muted-foreground mt-1">Verified</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Full Name</label>
                <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Username</label>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Choose a username" />
              </div>

              <Button onClick={handleSave} disabled={saving} className="w-full">
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>Manage your security preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Lock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-muted-foreground">Change your password</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">Change</Button>
              </div>

              <div className="p-4 rounded-lg border bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium">Active Sessions ({sessions.length})</p>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <p className="text-sm text-muted-foreground">Manage devices where you're signed in</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>Manage your saved payment methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                <p className="text-muted-foreground mb-3">No saved payment methods</p>
                <Button variant="outline" size="sm">Add Payment Method</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
