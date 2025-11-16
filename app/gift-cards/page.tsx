'use client'

import { useState } from 'react'
import Navigation from '@/components/navigation'
import Footer from '@/components/footer'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Gift, Check } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { motion } from 'framer-motion'

const giftCardAmounts = [25, 50, 100, 200]

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState(50)
  const [recipientEmail, setRecipientEmail] = useState('')
  const [message, setMessage] = useState('')
  const { toast } = useToast()

  function handlePurchase() {
    toast({
      title: 'Gift Card Purchased',
      description: 'The gift card will be sent to the recipient shortly',
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Gift className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Gift Cards
            </span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Give the gift of premium gaming tools
          </p>
        </motion.div>

        <Card className="glass-card border-primary/20">
          <CardHeader>
            <CardTitle>Purchase Gift Card</CardTitle>
            <CardDescription>
              Send a digital gift card to friends or family
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-3 block">Select Amount</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {giftCardAmounts.map((amount) => (
                  <motion.button
                    key={amount}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedAmount(amount)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      selectedAmount === amount
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-2xl font-bold">${amount}</div>
                    {selectedAmount === amount && (
                      <Check className="h-4 w-4 text-primary mx-auto mt-1" />
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="recipient">Recipient Email</Label>
              <Input
                id="recipient"
                type="email"
                placeholder="friend@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="message">Personal Message (Optional)</Label>
              <textarea
                id="message"
                className="w-full p-3 rounded-lg border bg-background"
                rows={3}
                placeholder="Add a personal message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <div className="p-4 rounded-lg bg-muted/20 border">
              <div className="flex justify-between items-center mb-2">
                <span>Gift Card Amount</span>
                <span className="font-bold">${selectedAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${selectedAmount.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full bg-gradient-to-r from-primary to-accent"
              size="lg"
              onClick={handlePurchase}
              disabled={!recipientEmail}
            >
              <Gift className="h-4 w-4 mr-2" />
              Purchase Gift Card
            </Button>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
