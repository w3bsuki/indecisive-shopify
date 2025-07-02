"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Filter } from "lucide-react"

interface Review {
  id: number
  customerName: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
  productName: string
  productImage: string
  productId: number
}

interface ReviewsClientProps {
  reviews: Review[]
}

export function ReviewsClient({ reviews }: ReviewsClientProps) {
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")

  // Filter and sort
  const filteredAndSortedReviews = reviews
    .filter((review) => {
      if (filterBy === "all") return true
      if (filterBy === "verified") return review.verified
      if (filterBy === "5-star") return review.rating === 5
      if (filterBy === "4-star") return review.rating === 4
      if (filterBy === "3-star") return review.rating === 3
      return true
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime()
      if (sortBy === "highest") return b.rating - a.rating
      if (sortBy === "lowest") return a.rating - b.rating
      return 0
    })

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
        <div className="flex gap-4">
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-40 font-mono text-sm">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="5-star">5 Star</SelectItem>
              <SelectItem value="4-star">4 Star</SelectItem>
              <SelectItem value="3-star">3 Star</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 font-mono text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-black/60 font-mono">{filteredAndSortedReviews.length} reviews</p>
      </div>

      {/* Reviews */}
      <div className="space-y-8">
        {filteredAndSortedReviews.map((review) => (
          <div key={review.id} className="border-b border-black/10 pb-8">
            {/* Product Info */}
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 relative">
                <Image
                  src={review.productImage || "/placeholder.svg"}
                  alt={review.productName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="font-bold font-mono">{review.productName}</h3>
                <Link
                  href={`/product/${review.productId}`}
                  className="text-sm text-black/60 hover:text-black transition-colors"
                >
                  View Product →
                </Link>
              </div>
            </div>

            {/* Review Content */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? "text-black fill-black" : "text-black/30 fill-black/30"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono font-bold text-sm">{review.customerName}</span>
                  {review.verified && (
                    <Badge className="bg-green-100 text-green-800 text-xs font-mono">VERIFIED</Badge>
                  )}
                </div>
                <span className="text-sm text-black/60 font-mono">{new Date(review.date).toLocaleDateString()}</span>
              </div>

              <h4 className="font-bold font-mono">{review.title}</h4>
              <p className="text-sm text-black/80 leading-relaxed">{review.content}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredAndSortedReviews.length === 0 && (
        <div className="text-center py-12">
          <p className="text-black/60 font-mono">No reviews match your current filters.</p>
        </div>
      )}
    </div>
  )
}