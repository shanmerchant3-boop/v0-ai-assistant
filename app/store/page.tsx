"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ProductCard from "@/components/product-card"
import { ProductSkeleton } from "@/components/product-skeleton"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, SlidersHorizontal, X, TrendingUp } from 'lucide-react'
import { seedProducts } from "@/lib/data/products"
import { Badge } from "@/components/ui/badge"

export default function StorePage() {
  const [filteredProducts, setFilteredProducts] = useState(seedProducts)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 200])
  const [sortBy, setSortBy] = useState("popularity")
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    let filtered = seedProducts

    if (search) {
      filtered = filtered.filter((p) => 
        p.title.toLowerCase().includes(search.toLowerCase()) || 
        p.shortDescription.toLowerCase().includes(search.toLowerCase())
      )
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    filtered = filtered.filter((p) => {
      const lowestPrice = p.variants ? Math.min(...p.variants.map(v => v.price)) : p.price
      return lowestPrice >= priceRange[0] && lowestPrice <= priceRange[1]
    })

    switch (sortBy) {
      case "price-low":
        filtered.sort((a, b) => {
          const priceA = a.variants ? Math.min(...a.variants.map(v => v.price)) : a.price
          const priceB = b.variants ? Math.min(...b.variants.map(v => v.price)) : b.price
          return priceA - priceB
        })
        break
      case "price-high":
        filtered.sort((a, b) => {
          const priceA = a.variants ? Math.max(...a.variants.map(v => v.price)) : a.price
          const priceB = b.variants ? Math.max(...b.variants.map(v => v.price)) : b.price
          return priceB - priceA
        })
        break
      case "name":
        filtered.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "newest":
        filtered.sort((a, b) => (b.specs?.Updated || "").localeCompare(a.specs?.Updated || ""))
        break
      default: // popularity
        break
    }

    setFilteredProducts(filtered)
  }, [search, selectedCategory, priceRange, sortBy])

  const categories = ["All", ...new Set(seedProducts.map((p) => p.category))]

  const clearFilters = () => {
    setSelectedCategory("All")
    setPriceRange([0, 200])
    setSortBy("popularity")
    setSearch("")
  }

  const containerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const activeFiltersCount = 
    (selectedCategory !== "All" ? 1 : 0) +
    (priceRange[0] !== 0 || priceRange[1] !== 200 ? 1 : 0)

  return (
    <div className="min-h-screen bg-background relative">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold">
              Our <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">Products</span>
            </h1>
            <Badge className="bg-gradient-to-r from-red-500 to-orange-500 border-0">
              <TrendingUp className="h-3 w-3 mr-1" />
              Hot
            </Badge>
          </div>
          <p className="text-lg text-muted-foreground">Undetected, Secure & Always Updated Gaming Cheats For Every Battle</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4 mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search products, tags..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 glass-card border-primary/20 focus:border-primary/50"
              />
            </div>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full md:w-[200px] glass-card border-primary/20">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popularity">Most Popular</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name: A to Z</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="glass-card border-primary/20 hover:border-primary/50 relative"
            >
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 bg-primary text-primary-foreground h-5 w-5 p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <Card className="border-primary/20">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Advanced Filters</CardTitle>
                    {activeFiltersCount > 0 && (
                      <Button variant="ghost" size="sm" onClick={clearFilters}>
                        <X className="h-4 w-4 mr-1" />
                        Clear All
                      </Button>
                    )}
                  </div>
                  <CardDescription>Refine your search results</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Category Filter */}
                  <div>
                    <h3 className="font-semibold mb-3 text-sm">Category</h3>
                    <div className="flex gap-2 flex-wrap">
                      {categories.map((cat) => (
                        <Button
                          key={cat}
                          size="sm"
                          variant={selectedCategory === cat ? "default" : "outline"}
                          onClick={() => setSelectedCategory(cat)}
                          className={
                            selectedCategory === cat
                              ? "bg-gradient-to-r from-primary to-accent"
                              : "border-border/50"
                          }
                        >
                          {cat}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Price Range */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-sm">Price Range</h3>
                      <span className="text-sm text-muted-foreground">
                        ${priceRange[0]} - ${priceRange[1]}
                      </span>
                    </div>
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      min={0}
                      max={200}
                      step={5}
                      className="mb-2"
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeFiltersCount > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {selectedCategory !== "All" && (
                <Badge variant="secondary" className="gap-1">
                  {selectedCategory}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setSelectedCategory("All")}
                  />
                </Badge>
              )}
              {(priceRange[0] !== 0 || priceRange[1] !== 200) && (
                <Badge variant="secondary" className="gap-1">
                  ${priceRange[0]}-${priceRange[1]}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => setPriceRange([0, 200])}
                  />
                </Badge>
              )}
            </div>
          )}
        </motion.div>

        <div className="mb-4 text-sm text-muted-foreground">
          Showing {filteredProducts.length} of {seedProducts.length} products
        </div>

        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No products found</h3>
            <p className="text-muted-foreground mb-4">Try adjusting your filters or search terms</p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="initial"
            animate="animate"
          >
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  )
}
