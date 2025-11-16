'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Shield, Smartphone, Trash2, CheckCircle, AlertTriangle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import Link from 'next/link'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

export default function SecurityPage() {
  const [user, setUser] = useState<any>(null)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [deleteConfirmText, setDeleteConfirmText] = useState('')
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    loadSecurityData()
  }, [])

  async function loadSecurityData() {
    const { data: { user: authUser } } = await supabase.auth.getUser()
    if (!authUser) {
      router.push('/auth/login')
      return
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .single()

    const { data: activeSessions } = await supabase
      .from('session_logs')
      .select('*')
      .eq('user_id', authUser.id)
      .order('created_at', { ascending: false })
      .limit(5)

    setUser(authUser)
    setTwoFactorEnabled(profile?.two_factor_enabled || false)
    setSessions(activeSessions || [])
    setLoading(false)
  }

  async function handleEnable2FA() {
    try {
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
      })

      if (error) throw error

      toast({
        title: '2FA Setup',
        description: 'Scan the QR code with your authenticator app',
      })

      // Update profile
      await supabase
        .from('profiles')
        .update({ two_factor_enabled: true })
        .eq('id', user.id)

      setTwoFactorEnabled(true)
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  async function handleDisable2FA() {
    try {
      // Disable 2FA logic here
      await supabase
        .from('profiles')
        .update({ two_factor_enabled: false })
        .eq('id', user.id)

      setTwoFactorEnabled(false)
      toast({
        title: 'Success',
        description: 'Two-factor authentication has been disabled',
      })
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  async function handleDeleteAccount() {
    if (deleteConfirmText !== 'DELETE MY ACCOUNT') {
      toast({
        title: 'Error',
        description: 'Please type the confirmation text exactly',
        variant: 'destructive',
      })
      return
    }

    try {
      // Delete user data
      await supabase.from('profiles').delete().eq('id', user.id)
      await supabase.from('orders').delete().eq('user_id', user.id)
      await supabase.from('license_keys').delete().eq('user_id', user.id)

      // Sign out
      await supabase.auth.signOut()

      toast({
        title: 'Account Deleted',
        description: 'Your account has been permanently deleted',
      })

      router.push('/')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/dashboard/settings">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Settings
          </Link>
        </Button>

        <h1 className="text-3xl font-bold mb-8">Security Settings</h1>

        <div className="space-y-6">
          {/* 2FA Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5" />
                Two-Factor Authentication
              </CardTitle>
              <CardDescription>
                Add an extra layer of security to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="flex items-center gap-3">
                  <Shield className={`h-8 w-8 ${twoFactorEnabled ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="font-medium">
                      {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {twoFactorEnabled
                        ? 'Your account is protected with 2FA'
                        : 'Protect your account with 2FA'}
                    </p>
                  </div>
                </div>
                {twoFactorEnabled ? (
                  <Button variant="destructive" onClick={handleDisable2FA}>
                    Disable
                  </Button>
                ) : (
                  <Button onClick={handleEnable2FA}>Enable 2FA</Button>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Active Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
              <CardDescription>Devices where you're currently signed in</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No active sessions</p>
                ) : (
                  sessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <p className="font-medium">
                          {session.device_info?.browser || 'Unknown Browser'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {session.ip_address} • {new Date(session.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible and destructive actions</CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" className="w-full">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <div className="my-4">
                    <label className="text-sm font-medium mb-2 block">
                      Type "DELETE MY ACCOUNT" to confirm:
                    </label>
                    <Input
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      placeholder="DELETE MY ACCOUNT"
                    />
                  </div>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDeleteAccount}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Delete Account
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
