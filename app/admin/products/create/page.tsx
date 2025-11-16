"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X, Plus, ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

export default function CreateProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)

  // Basic info
  const [title, setTitle] = useState("")
  const [shortDescription, setShortDescription] = useState("")
  const [longDescription, setLongDescription] = useState("")
  const [category, setCategory] = useState("gaming")
  const [badge, setBadge] = useState("Undetected")
  const [status, setStatus] = useState("available")
  const [imageUrl, setImageUrl] = useState("")

  // Features
  const [features, setFeatures] = useState<string[]>([])
  const [featureInput, setFeatureInput] = useState("")

  // Tags
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")

  // Variants (pricing)
  const [variants, setVariants] = useState([
    { duration: "7 Days", price: 14.99, description: "" },
    { duration: "30 Days", price: 39.99, description: "" },
    { duration: "Lifetime", price: 99.99, description: "" },
  ])

  // Specs
  const [specs, setSpecs] = useState({
    Platform: "Windows 10/11",
    Support: "Discord + Email",
    Updated: new Date().toLocaleDateString(),
  })

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeatures([...features, featureInput.trim()])
      setFeatureInput("")
    }
  }

  const removeFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index))
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const updateVariant = (index: number, field: string, value: any) => {
    const updated = [...variants]
    updated[index] = { ...updated[index], [field]: value }
    setVariants(updated)
  }

  const addVariant = () => {
    setVariants([...variants, { duration: "", price: 0, description: "" }])
  }

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      // Calculate base price from lowest variant
      const basePrice = Math.min(...variants.map((v) => v.price))

      const productData = {
        name: title,
        slug: title.toLowerCase().replace(/\s+/g, "-"),
        short_description: shortDescription,
        long_description: longDescription,
        price: basePrice,
        category,
        badge,
        status,
        image_url: imageUrl || "/placeholder.svg?height=600&width=600",
        features,
        tags,
        variants: variants.map((v) => ({
          ...v,
          description: v.description || `${v.duration} access to ${title}`,
        })),
        specs,
      }

      const { error } = await supabase.from("products").insert([productData])

      if (error) throw error

      toast({
        title: "Success!",
        description: "Product created successfully",
      })

      router.push("/admin/products")
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create product",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/admin/products">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Products
          </Button>
        </Link>

        <h1 className="text-3xl font-bold text-primary mb-2">Create New Product</h1>
        <p className="text-muted-foreground mb-8">Add a new product with full customization</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Essential product details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Product Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Valorant Private"
                  required
                />
              </div>

              <div>
                <Label htmlFor="short">Short Description *</Label>
                <Input
                  id="short"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Brief one-liner"
                  required
                />
              </div>

              <div>
                <Label htmlFor="long">Long Description *</Label>
                <Textarea
                  id="long"
                  value={longDescription}
                  onChange={(e) => setLongDescription(e.target.value)}
                  placeholder="Detailed product description"
                  rows={4}
                  required
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="security">Security</SelectItem>
                      <SelectItem value="tools">Tools</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <Select value={status} onValueChange={setStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="sold_out">Sold Out</SelectItem>
                      <SelectItem value="coming_soon">Coming Soon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="badge">Badge</Label>
                  <Input
                    id="badge"
                    value={badge}
                    onChange={(e) => setBadge(e.target.value)}
                    placeholder="e.g., Undetected, New, Hot"
                  />
                </div>

                <div>
                  <Label htmlFor="image">Image URL</Label>
                  <Input
                    id="image"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pricing Variants */}
          <Card>
            <CardHeader>
              <CardTitle>Pricing Variants</CardTitle>
              <CardDescription>Set up different pricing tiers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {variants.map((variant, index) => (
                <div key={index} className="flex gap-3 items-end p-4 border rounded-lg">
                  <div className="flex-1">
                    <Label>Duration</Label>
                    <Input
                      value={variant.duration}
                      onChange={(e) => updateVariant(index, "duration", e.target.value)}
                      placeholder="e.g., 7 Days, 30 Days, Lifetime"
                    />
                  </div>
                  <div className="w-32">
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={variant.price}
                      onChange={(e) => updateVariant(index, "price", parseFloat(e.target.value))}
                      placeholder="0.00"
                    />
                  </div>
                  {variants.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeVariant(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addVariant} className="w-full">
                <Plus className="h-4 w-4 mr-2" />
                Add Pricing Tier
              </Button>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>List product features</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={featureInput}
                  onChange={(e) => setFeatureInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addFeature())}
                  placeholder="e.g., Windows 10/11 support"
                />
                <Button type="button" onClick={addFeature}>
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded">
                    <span className="text-sm">{feature}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>Add searchable tags</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                  placeholder="e.g., valorant, competitive"
                />
                <Button type="button" onClick={addTag}>
                  Add
                </Button>
              </div>
              <div className="flex gap-2 flex-wrap">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="gap-1">
                    {tag}
                    <X
                      className="h-3 w-3 cursor-pointer"
                      onClick={() => removeTag(tag)}
                    />
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Specifications */}
          <Card>
            <CardHeader>
              <CardTitle>Specifications</CardTitle>
              <CardDescription>Technical details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Platform</Label>
                <Input
                  value={specs.Platform}
                  onChange={(e) => setSpecs({ ...specs, Platform: e.target.value })}
                />
              </div>
              <div>
                <Label>Support</Label>
                <Input
                  value={specs.Support}
                  onChange={(e) => setSpecs({ ...specs, Support: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Product"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
