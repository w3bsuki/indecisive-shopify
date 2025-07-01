import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Metadata } from "next"
import { ReviewsClient } from "@/components/reviews/reviews-client"

export const metadata: Metadata = {
  title: "Customer Reviews | Indecisive Wear - Real Customer Feedback",
  description: "Read authentic reviews from our customers about their favorite streetwear pieces. See what makes Indecisive Wear special through real customer experiences.",
  openGraph: {
    title: "Customer Reviews | Indecisive Wear",
    description: "Real customer feedback and reviews",
    type: "website",
  },
}

// Mock data for all product reviews
const allProductReviews = [
  {
    productId: 1,
    productName: "Essential White Tee",
    productImage: "/placeholder.svg?height=100&width=100",
    reviews: [
      {
        id: 1,
        customerName: "Sarah M.",
        rating: 5,
        title: "Perfect Essential Tee",
        content: "This tee is exactly what I was looking for. The quality is outstanding...",
        date: "2024-01-15",
        verified: true,
      },
      {
        id: 2,
        customerName: "Alex K.",
        rating: 4,
        title: "Great quality, slightly oversized",
        content: "Love the quality and the clean design. The fabric feels premium...",
        date: "2024-01-10",
        verified: true,
      },
    ],
  },
  {
    productId: 2,
    productName: "Shadow Bomber",
    productImage: "/placeholder.svg?height=100&width=100",
    reviews: [
      {
        id: 3,
        customerName: "Jordan P.",
        rating: 5,
        title: "Amazing bomber jacket",
        content: "This bomber is incredible. The fit is perfect and the quality is top-notch...",
        date: "2024-01-12",
        verified: true,
      },
    ],
  },
]

export default function ReviewsPage() {
  // Server-side data preparation
  const allReviews = allProductReviews.flatMap((product) =>
    product.reviews.map((review) => ({
      ...review,
      productName: product.productName,
      productImage: product.productImage,
      productId: product.productId,
    })),
  )

  return (
    <div className="min-h-screen bg-white font-mono">
      {/* Server-rendered Header */}
      <header className="border-b-2 border-black py-6 md:py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 hover:opacity-70 transition-opacity">
              <ArrowLeft className="h-5 w-5" />
              <span className="font-mono font-medium">BACK TO STORE</span>
            </Link>
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">CUSTOMER REVIEWS</h1>
              <p className="text-black/60 text-sm md:text-base mt-1">What our customers are saying</p>
            </div>
            <div className="w-24"></div>
          </div>
        </div>
      </header>

      {/* Client Component for Interactive Reviews */}
      <ReviewsClient reviews={allReviews} />
    </div>
  )
}
