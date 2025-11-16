'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { ArrowLeft, Save, RefreshCw } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function AnnouncementManagement() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [announcement, setAnnouncement] = useState({
    id: '',
    message: '',
    link_text: '',
    link_url: '',
    subtitle: '',
    is_active: true
  })

  useEffect(() => {
    loadAnnouncement()
  }, [])

  async function loadAnnouncement() {
    setLoading(true)
    const supabase = createClient()
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (data) {
      setAnnouncement(data)
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    const supabase = createClient()

    const { error } = await supabase
      .from('announcements')
      .update({
        message: announcement.message,
        link_text: announcement.link_text,
        link_url: announcement.link_url,
        subtitle: announcement.subtitle,
        is_active: announcement.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', announcement.id)

    if (error) {
      console.error('[v0] Error saving announcement:', error)
      alert('Failed to save announcement: ' + error.message)
    } else {
      alert('Announcement updated successfully!')
      // Clear localStorage so users see the new announcement
      localStorage.removeItem('announcement-bar-dismissed')
      window.location.reload()
    }

    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <RefreshCw className="h-6 w-6 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/admin')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
          <h1 className="text-4xl font-bold mb-2">Announcement Management</h1>
          <p className="text-muted-foreground">Edit the site-wide announcement banner</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Announcement Settings</CardTitle>
            <CardDescription>
              Configure the announcement banner that appears at the top of all pages
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="message">Main Message</Label>
              <Textarea
                id="message"
                value={announcement.message}
                onChange={(e) => setAnnouncement({ ...announcement, message: e.target.value })}
                placeholder="Join our Discord community for exclusive updates and support! 🎮"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="link_text">Link Text</Label>
                <Input
                  id="link_text"
                  value={announcement.link_text}
                  onChange={(e) => setAnnouncement({ ...announcement, link_text: e.target.value })}
                  placeholder="discord.gg/zaliantud"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="link_url">Link URL</Label>
                <Input
                  id="link_url"
                  type="url"
                  value={announcement.link_url}
                  onChange={(e) => setAnnouncement({ ...announcement, link_url: e.target.value })}
                  placeholder="https://discord.gg/zaliantud"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle (optional)</Label>
              <Input
                id="subtitle"
                value={announcement.subtitle}
                onChange={(e) => setAnnouncement({ ...announcement, subtitle: e.target.value })}
                placeholder="get exclusive perks and early access to new products"
              />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-0.5">
                <Label htmlFor="is_active">Active</Label>
                <p className="text-sm text-muted-foreground">
                  Show the announcement banner to users
                </p>
              </div>
              <Switch
                id="is_active"
                checked={announcement.is_active}
                onCheckedChange={(checked) => setAnnouncement({ ...announcement, is_active: checked })}
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleSave}
                disabled={saving}
                className="flex-1"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>How the announcement will appear to users</CardDescription>
          </CardHeader>
          <CardContent>
            {announcement.is_active ? (
              <div className="bg-gradient-to-r from-primary via-purple-600 to-accent text-white py-3 px-4 rounded-lg">
                <div className="flex flex-col items-center gap-1">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">{announcement.message}</span>
                    <span className="text-sm font-bold underline">{announcement.link_text}</span>
                  </div>
                  {announcement.subtitle && (
                    <p className="text-xs opacity-80">{announcement.subtitle}</p>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-4">
                Announcement is currently inactive
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
