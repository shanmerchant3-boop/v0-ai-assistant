import { createClient } from "@/lib/supabase/client"

export interface ProductVariant {
  id: string
  name: string
  price: number
  billing_cycle?: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  long_description: string
  price: number
  category: string
  image_url: string
  features: string[]
  variants: ProductVariant[]
  rating: number
  reviews_count: number
}

export async function getProducts(): Promise<Product[]> {
  const supabase = createClient()
  const { data } = await supabase.from("products").select("*").eq("active", true)

  return data || []
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = createClient()
  const { data } = await supabase.from("products").select("*").eq("slug", slug).single()

  return data || null
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = createClient()
  const { data } = await supabase.from("products").select("*").eq("id", id).single()

  return data || null
}
