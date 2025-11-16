'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Shield, Settings, Play } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface DownloadInstructionsProps {
  productName: string
}

export function DownloadInstructions({ productName }: DownloadInstructionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Download & Installation Instructions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Make sure to disable your antivirus before downloading and installing {productName}
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              1
            </div>
            <div>
              <h4 className="font-semibold mb-1">Download the file</h4>
              <p className="text-sm text-muted-foreground">
                Click the download button in your dashboard or check your email for the download link
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              2
            </div>
            <div>
              <h4 className="font-semibold mb-1">Extract the archive</h4>
              <p className="text-sm text-muted-foreground">
                Right-click the downloaded file and select "Extract All" or use WinRAR/7-Zip
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              3
            </div>
            <div>
              <h4 className="font-semibold mb-1">Run as Administrator</h4>
              <p className="text-sm text-muted-foreground">
                Right-click the executable and select "Run as administrator"
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              4
            </div>
            <div>
              <h4 className="font-semibold mb-1">Enter your license key</h4>
              <p className="text-sm text-muted-foreground">
                Copy your license key from the email or dashboard and paste it into the application
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
              5
            </div>
            <div>
              <h4 className="font-semibold mb-1">Start the game</h4>
              <p className="text-sm text-muted-foreground">
                Launch the game and enjoy! The cheat will automatically inject
              </p>
            </div>
          </div>
        </div>

        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription>
            Need help? Join our Discord server or contact support for assistance
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}
