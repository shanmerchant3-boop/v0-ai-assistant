import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Key, Download, Copy, AlertCircle } from 'lucide-react'
import Link from 'next/link'

export default async function LicensesPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: licenses } = await supabase
    .from('licenses')
    .select(`
      *,
      products (*),
      orders (*)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const activeLicenses = licenses?.filter(l => l.status === 'active') || []
  const expiredLicenses = licenses?.filter(l => l.status === 'expired') || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">License Keys</h1>
        <p className="text-muted-foreground">Manage your product licenses and downloads</p>
      </div>

      <div className="grid gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Active Licenses ({activeLicenses.length})</CardTitle>
            <CardDescription>Your currently active product licenses</CardDescription>
          </CardHeader>
          <CardContent>
            {activeLicenses.length > 0 ? (
              <div className="space-y-4">
                {activeLicenses.map((license) => (
                  <div key={license.id} className="p-4 rounded-lg border border-border/50 bg-muted/20">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{license.products?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Purchased {new Date(license.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge className="bg-green-500/10 text-green-500 border-green-500/20">
                        Active
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-2 p-3 rounded bg-background border font-mono text-sm">
                        <Key className="h-4 w-4 text-primary" />
                        <code className="flex-1">{license.license_key}</code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigator.clipboard.writeText(license.license_key)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>

                      {license.hwid && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <AlertCircle className="h-4 w-4" />
                          <span>Bound to HWID: {license.hwid.slice(0, 16)}...</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t">
                        <span className="text-sm text-muted-foreground">
                          {license.expires_at ? 
                            `Expires: ${new Date(license.expires_at).toLocaleDateString()}` :
                            'Lifetime License'
                          }
                        </span>
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/dashboard/downloads?product=${license.product_id}`}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-8 text-muted-foreground">No active licenses</p>
            )}
          </CardContent>
        </Card>

        {expiredLicenses.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Expired Licenses ({expiredLicenses.length})</CardTitle>
              <CardDescription>Renew to regain access</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {expiredLicenses.map((license) => (
                  <div key={license.id} className="p-4 rounded-lg border border-border/50 bg-muted/10">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{license.products?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          Expired: {new Date(license.expires_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" asChild>
                        <Link href={`/store/${license.products?.id}`}>Renew</Link>
                      </Button>
                    </div>
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
