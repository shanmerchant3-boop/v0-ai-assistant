import { notFound, redirect } from 'next/navigation'
import Header from "@/components/header"
import Footer from "@/components/footer"
import FireParticles from "@/components/fire-particles"
import VouchForm from "@/components/vouch-form"
import { createClient } from "@/lib/supabase/server"
import { seedProducts } from "@/lib/data/products"

export default async function VouchPage({ params }: { params: { id: string } }) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const product = seedProducts.find((p) => p.id === id)

  if (!product) {
    notFound()
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "completed")

  const hasPurchased = orders?.some((order) => {
    const items = order.items as any[]
    return items.some((item) => item.product_id === id)
  })

  if (!hasPurchased) {
    return (
      <div className="min-h-screen bg-background relative overflow-hidden">
        <div className="fixed inset-0 z-0">
          <FireParticles
            count={70}
            colors={["#FFD27F", "#FF8A4B", "#FF4AD6", "#7D5FFF"]}
            size={[6, 20]}
            speed={0.08}
            wind={0.1}
            intensity={0.85}
          />
        </div>

        <div className="relative z-10">
          <Header />
          <main className="container mx-auto px-4 py-20">
            <div className="max-w-2xl mx-auto glass-card p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Purchase Required</h1>
              <p className="text-muted-foreground mb-6">
                You need to purchase {product.title} before leaving a vouch.
              </p>
            </div>
          </main>
          <Footer />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <FireParticles
          count={70}
          colors={["#FFD27F", "#FF8A4B", "#FF4AD6", "#7D5FFF"]}
          size={[6, 20]}
          speed={0.08}
          wind={0.1}
          intensity={0.85}
        />
      </div>

      <div className="relative z-10">
        <Header />
        <main className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto">
            <VouchForm productId={id} productName={product.title} />
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}
