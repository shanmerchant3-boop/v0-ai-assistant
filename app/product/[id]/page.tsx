"use client"

import { useState } from "react"
import { PRODUCTS } from "@/lib/products"
import { useCart } from "@/context/cart-context"
import { ChevronDown } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import ProductCard from "@/components/product-card"

interface Props {
  params: Promise<{ id: string }>
}

export default function ProductPage({ params }: Props) {
  const [quantity, setQuantity] = useState(1)
  const [promoInput, setPromoInput] = useState("")
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null)
  const { addItem } = useCart()

  // Get params synchronously - note: in real app, should be awaited in async component
  const id = (params as any).id || ""
  const product = PRODUCTS.find((p) => p.id === id)
  const relatedProducts = PRODUCTS.filter((p) => p.id !== id && p.category === product?.category).slice(0, 3)

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Product not found</p>
      </div>
    )
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
      })
    }
    setQuantity(1)
  }

  return (
    <div className="min-h-screen pt-12 pb-20">
      <div className="max-w-7xl mx-auto px-4">
        <Link href="/store" className="text-zpurple hover:text-zpink mb-8 inline-block">
          ← Back to Store
        </Link>

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          {/* Product Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-gray-800 rounded-lg overflow-hidden h-fit"
          >
            <div className="relative h-96">
              <Image
                src={product.image || "/placeholder.svg"}
                alt={product.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            <div>
              <div className="flex gap-2 mb-4">
                {product.tags.map((tag) => (
                  <span key={tag} className="text-xs px-3 py-1 bg-zpurple/20 text-zpurple rounded">
                    {tag}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl font-bold mb-4">{product.title}</h1>
              <p className="text-gray-400 text-lg mb-6">{product.description}</p>
              <p className="text-3xl font-bold text-gradient">${product.price}</p>
            </div>

            {/* Add to Cart */}
            <div className="space-y-4 bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  −
                </button>
                <span className="text-2xl font-bold min-w-12 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  +
                </button>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                className="btn-primary w-full"
              >
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </motion.button>

              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Promo code"
                  value={promoInput}
                  onChange={(e) => setPromoInput(e.target.value)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-zpurple"
                />
                <button className="px-4 py-2 bg-zpurple hover:bg-zpurple/80 rounded text-white transition-colors">
                  Apply
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <h3 className="font-bold text-lg mb-4">Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature, i) => (
                  <li key={i} className="flex gap-3 text-gray-300">
                    <span className="text-zpurple mt-1">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="bg-gray-800 rounded-lg p-8 border border-gray-700 mb-12"
        >
          <h2 className="text-2xl font-bold mb-4">Full Description</h2>
          <p className="text-gray-300 leading-relaxed">{product.longDescription}</p>
        </motion.div>

        {/* FAQ */}
        {product.faq.length > 0 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-12">
            <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {product.faq.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setExpandedFAQ(expandedFAQ === i ? null : i)}
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg p-4 text-left hover:border-zpurple transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{item.question}</span>
                    <ChevronDown className={`w-5 h-5 transition-transform ${expandedFAQ === i ? "rotate-180" : ""}`} />
                  </div>
                  {expandedFAQ === i && <p className="text-gray-400 mt-3">{item.answer}</p>}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
            <h2 className="text-2xl font-bold mb-8">Related Products</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {relatedProducts.map((related) => (
                <ProductCard key={related.id} {...related} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
