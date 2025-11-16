import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, FileArchive, Calendar } from 'lucide-react'

export default async function DownloadsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: licenses } = await supabase
    .from('license_keys')
    .select(`
      *,
      products (*)
    `)
    .eq('user_id', user.id)
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  const { data: downloads } = await supabase
    .from('downloads')
    .select('*')
    .eq('user_id', user.id)
    .order('downloaded_at', { ascending: false })
    .limit(10)

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Download Center</h1>
        <p className="text-muted-foreground">Access your purchased products and updates</p>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Available Downloads</CardTitle>
            <CardDescription>Download your active products</CardDescription>
          </CardHeader>
          <CardContent>
            {licenses && licenses.length > 0 ? (
              <div className="space-y-4">
                {licenses.map((license) => (
                  <div key={license.id} className="p-4 rounded-lg border border-border/50 bg-muted/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-lg bg-primary/10 flex items-center justify-center">
                          <FileArchive className="h-7 w-7 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">{license.products?.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Version: Latest • Updated recently
                          </p>
                        </div>
                      </div>
                      <Button>
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No downloads available</p>
            )}
          </CardContent>
        </Card>

        {downloads && downloads.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Download History</CardTitle>
              <CardDescription>Your recent downloads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {downloads.map((download) => (
                  <div key={download.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/10 text-sm">
                    <span className="font-medium">{download.file_name || 'Product Download'}</span>
                    <span className="text-muted-foreground flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {new Date(download.downloaded_at).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
