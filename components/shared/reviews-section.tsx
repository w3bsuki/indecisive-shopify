"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Star, ThumbsUp, ThumbsDown, Filter, Upload, X, Camera, Share2, Check } from "lucide-react"

interface Review {
  id: number
  customerName: string
  rating: number
  title: string
  content: string
  date: string
  verified: boolean
  helpful: number
  notHelpful: number
  size: string
  fit: "Runs Small" | "True to Size" | "Runs Large"
  images?: string[]
}

interface ReviewsSectionProps {
  productId: number
  productName: string
  averageRating: number
  totalReviews: number
}

// Mock reviews data with images
const mockReviews: Review[] = [
  {
    id: 1,
    customerName: "Sarah M.",
    rating: 5,
    title: "Perfect Essential Tee",
    content:
      "This tee is exactly what I was looking for. The quality is outstanding - soft, well-made, and the fit is perfect. I'm 5'6\" and ordered a medium, fits true to size. The minimalist design is exactly what I wanted. Will definitely be ordering more colors!",
    date: "2024-01-15",
    verified: true,
    helpful: 12,
    notHelpful: 0,
    size: "M",
    fit: "True to Size",
    images: [
      "/placeholder.svg?height=400&width=400&text=Review+Photo+1",
      "/placeholder.svg?height=400&width=400&text=Review+Photo+2",
    ],
  },
  {
    id: 2,
    customerName: "Alex K.",
    rating: 4,
    title: "Great quality, slightly oversized",
    content:
      "Love the quality and the clean design. The fabric feels premium and washes well. Only reason for 4 stars instead of 5 is that it runs a bit larger than expected. I usually wear L but could have gone with M. Still keeping it though - the oversized look works!",
    date: "2024-01-10",
    verified: true,
    helpful: 8,
    notHelpful: 1,
    size: "L",
    fit: "Runs Large",
    images: ["/placeholder.svg?height=400&width=400&text=Fit+Comparison"],
  },
  {
    id: 3,
    customerName: "Jordan P.",
    rating: 5,
    title: "Minimalist perfection",
    content:
      "This is my third purchase from Indecisive Wear and they never disappoint. The attention to detail is incredible - from the stitching to the fabric choice. This tee has become my go-to for both casual and slightly dressed up looks. Highly recommend!",
    date: "2024-01-08",
    verified: true,
    helpful: 15,
    notHelpful: 0,
    size: "S",
    fit: "True to Size",
    images: [
      "/placeholder.svg?height=400&width=400&text=Styled+Look+1",
      "/placeholder.svg?height=400&width=400&text=Styled+Look+2",
      "/placeholder.svg?height=400&width=400&text=Detail+Shot",
    ],
  },
  {
    id: 4,
    customerName: "Taylor R.",
    rating: 3,
    title: "Good but not great",
    content:
      "The tee is nice and the quality seems good, but I was expecting something more special for the price point. It's a basic tee that does the job, but doesn't feel particularly premium. The fit is good though.",
    date: "2024-01-05",
    verified: true,
    helpful: 3,
    notHelpful: 7,
    size: "M",
    fit: "True to Size",
  },
  {
    id: 5,
    customerName: "Casey L.",
    rating: 5,
    title: "Worth every penny",
    content:
      "Initially hesitated because of the price, but after wearing this for a few weeks, I can say it's worth it. The fabric is incredibly soft and has maintained its shape and color after multiple washes. The cut is flattering and versatile.",
    date: "2024-01-02",
    verified: true,
    helpful: 9,
    notHelpful: 1,
    size: "L",
    fit: "True to Size",
    images: ["/placeholder.svg?height=400&width=400&text=After+Washing"],
  },
]

export function ReviewsSection({ productId, productName, averageRating, totalReviews }: ReviewsSectionProps) {
  const [reviews, setReviews] = useState<Review[]>(mockReviews)
  const [sortBy, setSortBy] = useState("newest")
  const [filterBy, setFilterBy] = useState("all")
  const [showWriteReview, setShowWriteReview] = useState(false)

  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: reviews.filter((r) => r.rating === rating).length,
    percentage: (reviews.filter((r) => r.rating === rating).length / reviews.length) * 100,
  }))

  // Filter and sort reviews
  const filteredAndSortedReviews = reviews
    .filter((review) => {
      if (filterBy === "all") return true
      if (filterBy === "verified") return review.verified
      if (filterBy === "with-photos") return review.images && review.images.length > 0
      if (filterBy === "5-star") return review.rating === 5
      if (filterBy === "4-star") return review.rating === 4
      if (filterBy === "3-star") return review.rating === 3
      if (filterBy === "2-star") return review.rating === 2
      if (filterBy === "1-star") return review.rating === 1
      return true
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.date).getTime() - new Date(a.date).getTime()
      if (sortBy === "oldest") return new Date(a.date).getTime() - new Date(b.date).getTime()
      if (sortBy === "highest") return b.rating - a.rating
      if (sortBy === "lowest") return a.rating - b.rating
      if (sortBy === "helpful") return b.helpful - a.helpful
      if (sortBy === "with-photos") return (b.images?.length || 0) - (a.images?.length || 0)
      return 0
    })

  const handleHelpful = (reviewId: number, isHelpful: boolean) => {
    setReviews((prev) =>
      prev.map((review) =>
        review.id === reviewId
          ? {
              ...review,
              helpful: isHelpful ? review.helpful + 1 : review.helpful,
              notHelpful: !isHelpful ? review.notHelpful + 1 : review.notHelpful,
            }
          : review,
      ),
    )
  }

  const reviewsWithPhotos = reviews.filter((r) => r.images && r.images.length > 0).length

  return (
    <div className="space-y-8">
      {/* Reviews Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Rating Summary */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl font-bold font-mono">{averageRating}</div>
            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(averageRating) ? "text-black fill-black" : "text-black/30 fill-black/30"
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-black/60 font-mono">Based on {totalReviews} reviews</p>
              <p className="text-xs text-black/50 font-mono">{reviewsWithPhotos} with photos</p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {ratingDistribution.map(({ rating, count, percentage }) => (
              <div key={rating} className="flex items-center gap-3 text-sm">
                <span className="font-mono w-6">{rating}★</span>
                <div className="flex-1 bg-gray-200 h-2">
                  <div className="bg-black h-2 transition-all duration-300" style={{ width: `${percentage}%` }} />
                </div>
                <span className="font-mono text-black/60 w-8">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Write Review */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold font-mono uppercase tracking-wider">Share Your Experience</h3>
          <p className="text-sm text-black/70">Help other customers by sharing your thoughts and photos.</p>
          <WriteReviewDialog
            productName={productName}
            onReviewSubmit={(newReview) => {
              setReviews((prev) => [newReview, ...prev])
              setShowWriteReview(false)
            }}
          >
            <Button className="w-full bg-black text-white hover:bg-black/80 font-mono min-h-[44px] sharp-active">
              <Camera className="h-4 w-4 mr-2" />
              WRITE A REVIEW
            </Button>
          </WriteReviewDialog>
        </div>
      </div>

      <Separator />

      {/* Filters and Sorting */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <Select value={filterBy} onValueChange={setFilterBy}>
            <SelectTrigger className="w-40 font-mono text-sm min-h-[44px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reviews</SelectItem>
              <SelectItem value="verified">Verified Only</SelectItem>
              <SelectItem value="with-photos">With Photos</SelectItem>
              <SelectItem value="5-star">5 Star</SelectItem>
              <SelectItem value="4-star">4 Star</SelectItem>
              <SelectItem value="3-star">3 Star</SelectItem>
              <SelectItem value="2-star">2 Star</SelectItem>
              <SelectItem value="1-star">1 Star</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40 font-mono text-sm min-h-[44px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="oldest">Oldest First</SelectItem>
              <SelectItem value="highest">Highest Rated</SelectItem>
              <SelectItem value="lowest">Lowest Rated</SelectItem>
              <SelectItem value="helpful">Most Helpful</SelectItem>
              <SelectItem value="with-photos">Photos First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-black/60 font-mono">
          Showing {filteredAndSortedReviews.length} of {reviews.length} reviews
        </p>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredAndSortedReviews.map((review) => (
          <ReviewCard key={review.id} review={review} onHelpful={handleHelpful} />
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

function ReviewCard({ review, onHelpful }: { review: Review; onHelpful: (id: number, helpful: boolean) => void }) {
  const [hasVoted, setHasVoted] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const handleVote = (isHelpful: boolean) => {
    if (!hasVoted) {
      onHelpful(review.id, isHelpful)
      setHasVoted(true)
    }
  }

  return (
    <div className="border-b border-black/10 pb-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`h-4 w-4 ${i < review.rating ? "text-black fill-black" : "text-black/30 fill-black/30"}`}
              />
            ))}
          </div>
          <span className="font-mono font-bold text-sm">{review.customerName}</span>
          {review.verified && <Badge className="bg-green-100 text-green-800 text-xs font-mono">VERIFIED</Badge>}
          {review.images && review.images.length > 0 && (
            <Badge className="bg-blue-100 text-blue-800 text-xs font-mono">
              <Camera className="h-3 w-3 mr-1" />
              {review.images.length} PHOTO{review.images.length > 1 ? "S" : ""}
            </Badge>
          )}
        </div>
        <span className="text-sm text-black/60 font-mono">{new Date(review.date).toLocaleDateString()}</span>
      </div>

      <h4 className="font-bold mb-2 font-mono">{review.title}</h4>
      <p className="text-sm text-black/80 leading-relaxed mb-4">{review.content}</p>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {review.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(image)}
                className="flex-shrink-0 w-20 h-20 relative overflow-hidden border border-black/10 hover:border-black/30 transition-colors"
              >
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Review photo ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 mb-4 text-xs font-mono">
        <span>
          Size: <strong>{review.size}</strong>
        </span>
        <span>
          Fit: <strong>{review.fit}</strong>
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-sm text-black/60 font-mono">Was this helpful?</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleVote(true)}
              disabled={hasVoted}
              className={`flex items-center gap-1 px-3 py-2 min-h-[44px] text-xs font-mono transition-colors sharp-active ${
                hasVoted ? "text-black/40" : "text-black/60 hover:text-black"
              }`}
            >
              <ThumbsUp className="h-3 w-3" />
              {review.helpful}
            </button>
            <button
              onClick={() => handleVote(false)}
              disabled={hasVoted}
              className={`flex items-center gap-1 px-3 py-2 min-h-[44px] text-xs font-mono transition-colors sharp-active ${
                hasVoted ? "text-black/40" : "text-black/60 hover:text-black"
              }`}
            >
              <ThumbsDown className="h-3 w-3" />
              {review.notHelpful}
            </button>
          </div>
        </div>

      </div>

      {/* Image Modal */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-3xl">
            <div className="relative">
              <img
                src={selectedImage || "/placeholder.svg"}
                alt="Review photo"
                className="w-full h-auto max-h-[70vh] object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                onClick={() => setSelectedImage(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function WriteReviewDialog({
  productName,
  onReviewSubmit,
  children,
}: {
  productName: string
  onReviewSubmit: (review: Review) => void
  children: React.ReactNode
}) {
  const [rating, setRating] = useState(0)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [customerName, setCustomerName] = useState("")
  const [size, setSize] = useState("")
  const [fit, setFit] = useState<"Runs Small" | "True to Size" | "Runs Large">("True to Size")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return

    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/") && uploadedImages.length < 5) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const result = e.target?.result as string
          setUploadedImages((prev) => [...prev, result])
        }
        reader.readAsDataURL(file)
      }
    })
  }

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleImageUpload(e.dataTransfer.files)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0 || !title || !content || !customerName || !size) return

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newReview: Review = {
      id: Date.now(),
      customerName,
      rating,
      title,
      content,
      date: new Date().toISOString().split("T")[0],
      verified: false,
      helpful: 0,
      notHelpful: 0,
      size,
      fit,
      images: uploadedImages.length > 0 ? uploadedImages : undefined,
    }


    onReviewSubmit(newReview)

    // Show success message with social sharing option
    setShowSuccessDialog(true)

    // Reset form
    setRating(0)
    setTitle("")
    setContent("")
    setCustomerName("")
    setSize("")
    setFit("True to Size")
    setUploadedImages([])
    setIsSubmitting(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl font-mono max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold uppercase tracking-wider">Write a Review</DialogTitle>
          <p className="text-sm text-black/60">Share your experience with {productName}</p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating */}
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wider">Overall Rating *</label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} type="button" onClick={() => setRating(star)} className="p-1">
                  <Star
                    className={`h-6 w-6 transition-colors ${
                      star <= rating ? "text-black fill-black" : "text-black/30 hover:text-black/60"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wider">Your Name *</label>
            <Input
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              placeholder="Enter your name"
              className="font-mono"
              required
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wider">Review Title *</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Summarize your experience"
              className="font-mono"
              required
            />
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wider">Your Review *</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell us about your experience with this product..."
              className="font-mono min-h-[120px]"
              required
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wider">
              Add Photos (Optional)
              <span className="text-xs font-normal text-black/60 ml-2">Up to 5 photos</span>
            </label>

            {/* Upload Area */}
            <div
              className={`border-2 border-dashed p-6 text-center transition-colors ${
                isDragging ? "border-black bg-black/5" : "border-black/30 hover:border-black/50"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => handleImageUpload(e.target.files)}
                className="hidden"
                id="photo-upload"
                disabled={uploadedImages.length >= 5}
              />
              <label
                htmlFor="photo-upload"
                className={`cursor-pointer ${uploadedImages.length >= 5 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <Upload className="h-8 w-8 mx-auto mb-2 text-black/60" />
                <p className="text-sm font-mono text-black/60">
                  {uploadedImages.length >= 5
                    ? "Maximum 5 photos reached"
                    : "Drag & drop photos here or click to browse"}
                </p>
                <p className="text-xs font-mono text-black/40 mt-1">JPG, PNG up to 10MB each</p>
              </label>
            </div>

            {/* Uploaded Images Preview */}
            {uploadedImages.length > 0 && (
              <div className="mt-4">
                <div className="flex gap-2 flex-wrap">
                  {uploadedImages.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Upload ${index + 1}`}
                        className="w-20 h-20 object-cover border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Size and Fit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider">Size Purchased *</label>
              <Select value={size} onValueChange={setSize} required>
                <SelectTrigger className="font-mono">
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="XS">XS</SelectItem>
                  <SelectItem value="S">S</SelectItem>
                  <SelectItem value="M">M</SelectItem>
                  <SelectItem value="L">L</SelectItem>
                  <SelectItem value="XL">XL</SelectItem>
                  <SelectItem value="XXL">XXL</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-bold mb-2 uppercase tracking-wider">How does it fit?</label>
              <Select value={fit} onValueChange={(value: any) => setFit(value)}>
                <SelectTrigger className="font-mono">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Runs Small">Runs Small</SelectItem>
                  <SelectItem value="True to Size">True to Size</SelectItem>
                  <SelectItem value="Runs Large">Runs Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="bg-gray-50 p-4 text-xs text-black/70">
            <h4 className="font-bold mb-2 uppercase tracking-wider">Photo Guidelines</h4>
            <ul className="space-y-1">
              <li>• Show the product being worn or styled</li>
              <li>• Include fit and detail shots</li>
              <li>• Use good lighting for clear images</li>
              <li>• Avoid inappropriate content</li>
            </ul>
          </div>

          <div className="flex gap-4 pt-4">
            <Button
              type="submit"
              disabled={isSubmitting || rating === 0 || !title || !content || !customerName || !size}
              className="flex-1 bg-black text-white hover:bg-black/80 font-mono"
            >
              {isSubmitting ? "SUBMITTING..." : "SUBMIT REVIEW"}
            </Button>
          </div>
        </form>
        {showSuccessDialog && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 max-w-md mx-4 font-mono">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-bold">Review Submitted!</h3>
                <p className="text-sm text-black/70">
                  Thank you for sharing your experience. Your review helps other customers make better decisions.
                </p>


                <Button
                  onClick={() => setShowSuccessDialog(false)}
                  variant="outline"
                  className="w-full border-2 border-black hover:bg-black hover:text-white font-mono"
                >
                  CLOSE
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
