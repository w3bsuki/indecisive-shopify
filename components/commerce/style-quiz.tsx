'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronLeft, ChevronRight, Sparkles, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ShopifyProduct } from '@/lib/shopify/types'
import Image from 'next/image'
import Link from 'next/link'
import { useMarket } from '@/hooks/use-market'
import { QuickViewDialog } from './quick-view-dialog'

interface StyleOption {
  id: string
  label: string
  image?: string
  value: string
}

interface QuizQuestion {
  id: string
  question: string
  subtitle?: string
  options: StyleOption[]
  multiSelect?: boolean
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 'vibe',
    question: "What's your vibe?",
    subtitle: "Choose the style that speaks to you",
    options: [
      { id: 'minimal', label: 'MINIMAL', value: 'minimal', image: '🤍' },
      { id: 'streetwear', label: 'STREETWEAR', value: 'streetwear', image: '🖤' },
      { id: 'vintage', label: 'VINTAGE', value: 'vintage', image: '🤎' },
      { id: 'experimental', label: 'EXPERIMENTAL', value: 'experimental', image: '💜' }
    ]
  },
  {
    id: 'occasion',
    question: "Where are you wearing this?",
    subtitle: "Your outfit destination",
    options: [
      { id: 'everyday', label: 'EVERYDAY', value: 'casual', image: '☀️' },
      { id: 'work', label: 'WORK', value: 'smart-casual', image: '💼' },
      { id: 'weekend', label: 'WEEKEND', value: 'relaxed', image: '🌴' },
      { id: 'special', label: 'SPECIAL EVENT', value: 'statement', image: '✨' }
    ]
  },
  {
    id: 'color',
    question: "Color mood?",
    subtitle: "Pick your palette",
    options: [
      { id: 'mono', label: 'BLACK & WHITE', value: 'monochrome', image: '⚫' },
      { id: 'neutral', label: 'NEUTRALS', value: 'neutral', image: '🤍' },
      { id: 'bold', label: 'BOLD COLORS', value: 'colorful', image: '🌈' },
      { id: 'earth', label: 'EARTH TONES', value: 'earthy', image: '🤎' }
    ]
  },
  {
    id: 'personality',
    question: "How do you want to feel?",
    subtitle: "Choose up to 2",
    multiSelect: true,
    options: [
      { id: 'confident', label: 'CONFIDENT', value: 'confident', image: '💪' },
      { id: 'comfortable', label: 'COMFORTABLE', value: 'comfortable', image: '☁️' },
      { id: 'creative', label: 'CREATIVE', value: 'creative', image: '🎨' },
      { id: 'cool', label: 'COOL', value: 'cool', image: '😎' }
    ]
  },
  {
    id: 'budget',
    question: "What's your budget?",
    subtitle: "We'll find the perfect match",
    options: [
      { id: 'entry', label: 'UNDER ₽5,000', value: 'budget', image: '💸' },
      { id: 'mid', label: '₽5,000 - ₽10,000', value: 'mid', image: '💰' },
      { id: 'premium', label: '₽10,000 - ₽20,000', value: 'premium', image: '💎' },
      { id: 'luxury', label: 'NO LIMIT', value: 'luxury', image: '👑' }
    ]
  }
]

interface StyleQuizProps {
  products: ShopifyProduct[]
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function StyleQuiz({ products, isOpen, onOpenChange }: StyleQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({})
  const [showResults, setShowResults] = useState(false)
  const [recommendations, setRecommendations] = useState<ShopifyProduct[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const { formatPrice } = useMarket()

  const question = quizQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / quizQuestions.length) * 100

  const handleAnswer = (value: string) => {
    const question = quizQuestions[currentQuestion]
    
    if (question.multiSelect) {
      const currentAnswers = (answers[question.id] as string[]) || []
      const newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(v => v !== value)
        : [...currentAnswers, value].slice(0, 2) // Max 2 selections
      
      setAnswers({ ...answers, [question.id]: newAnswers })
    } else {
      setAnswers({ ...answers, [question.id]: value })
    }
  }

  const canProceed = () => {
    if (!question) return false
    const answer = answers[question.id]
    
    if (question.multiSelect) {
      return Array.isArray(answer) && answer.length > 0
    }
    return !!answer
  }

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      analyzeStyle()
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const analyzeStyle = () => {
    setIsAnalyzing(true)
    
    // Simulate analysis with timeout
    setTimeout(() => {
      // In a real app, this would use AI/ML to match products
      // For now, we'll do basic filtering based on answers
      const styleProfile = {
        vibe: answers.vibe as string,
        occasion: answers.occasion as string,
        color: answers.color as string,
        personality: answers.personality as string[],
        budget: answers.budget as string
      }

      // Filter products based on style profile
      let filtered = [...products]

      // Filter by price range
      if (styleProfile.budget === 'budget') {
        filtered = filtered.filter(p => 
          parseFloat(p.priceRange.minVariantPrice.amount) < 5000
        )
      } else if (styleProfile.budget === 'mid') {
        filtered = filtered.filter(p => {
          const price = parseFloat(p.priceRange.minVariantPrice.amount)
          return price >= 5000 && price <= 10000
        })
      }

      // Shuffle and take top 6
      const shuffled = filtered.sort(() => Math.random() - 0.5)
      setRecommendations(shuffled.slice(0, 6))
      setIsAnalyzing(false)
      setShowResults(true)
    }, 2000)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setRecommendations([])
  }

  // Reset when dialog closes
  useEffect(() => {
    if (!isOpen) {
      resetQuiz()
    }
  }, [isOpen])

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] md:max-w-3xl max-h-[90vh] border border-gray-200 rounded-none p-0 overflow-hidden">
        <button
          onClick={() => onOpenChange(false)}
          className="absolute right-4 top-4 z-10 w-10 h-10 flex items-center justify-center bg-white/90 backdrop-blur-sm hover:bg-white transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {!showResults ? (
          <div className="p-6 md:p-8">
            <DialogHeader className="mb-8">
              <DialogTitle className="text-2xl md:text-3xl font-mono text-center">
                STYLE QUIZ
              </DialogTitle>
              <Progress value={progress} className="mt-4 h-2" />
            </DialogHeader>

            {isAnalyzing ? (
              <div className="flex flex-col items-center justify-center py-16 space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
                  <div className="absolute top-0 left-0 w-20 h-20 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div className="text-center space-y-2">
                  <h3 className="font-mono text-lg">ANALYZING YOUR STYLE...</h3>
                  <p className="text-gray-600 text-sm">Creating personalized recommendations</p>
                </div>
              </div>
            ) : (
              <>
                {/* Question */}
                <div className="mb-8 text-center">
                  <h2 className="text-xl md:text-2xl font-medium mb-2">
                    {question.question}
                  </h2>
                  {question.subtitle && (
                    <p className="text-gray-600">{question.subtitle}</p>
                  )}
                </div>

                {/* Options */}
                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8">
                  {question.options.map((option) => {
                    const isSelected = question.multiSelect
                      ? (answers[question.id] as string[] || []).includes(option.value)
                      : answers[question.id] === option.value

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleAnswer(option.value)}
                        className={cn(
                          "p-4 md:p-6 border transition-all duration-200",
                          "hover:border-gray-400 hover:shadow-md",
                          "flex flex-col items-center justify-center gap-3",
                          "min-h-[120px] md:min-h-[140px]",
                          isSelected
                            ? "border-black bg-gray-50 shadow-md"
                            : "border-gray-200"
                        )}
                      >
                        {option.image && (
                          <span className="text-2xl md:text-3xl">{option.image}</span>
                        )}
                        <span className="font-mono text-sm md:text-base uppercase">
                          {option.label}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    BACK
                  </Button>

                  <span className="font-mono text-sm text-gray-600">
                    {currentQuestion + 1} / {quizQuestions.length}
                  </span>

                  <Button
                    onClick={handleNext}
                    disabled={!canProceed()}
                    className="gap-2"
                  >
                    {currentQuestion === quizQuestions.length - 1 ? 'SEE RESULTS' : 'NEXT'}
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="p-6 md:p-8">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-2xl md:text-3xl font-mono text-center">
                YOUR STYLE MATCHES
              </DialogTitle>
              <p className="text-center text-gray-600 mt-2">
                Based on your answers, we think you&apos;ll love these
              </p>
            </DialogHeader>

            {/* Style Profile Summary */}
            <div className="bg-gray-50 p-4 mb-6 space-y-2">
              <h3 className="font-mono text-sm font-medium mb-3">YOUR STYLE PROFILE:</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(answers).map(([key, value]) => {
                  const values = Array.isArray(value) ? value : [value]
                  return values.map((v, idx) => (
                    <span
                      key={`${key}-${idx}`}
                      className="px-3 py-1 bg-white border border-gray-200 font-mono text-xs uppercase"
                    >
                      {v}
                    </span>
                  ))
                })}
              </div>
            </div>

            {/* Product Recommendations */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 mb-6">
              {recommendations.map((product, index) => (
                <div key={product.id} className="group relative">
                  <div className="absolute -top-2 -left-2 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-mono text-xs z-10">
                    {index + 1}
                  </div>
                  
                  <QuickViewDialog product={product}>
                    <div className="cursor-pointer bg-white border border-gray-200 hover:border-gray-400 hover:shadow-md transition-all duration-200">
                      <div className="aspect-[3/4] relative bg-gray-50">
                        {product.featuredImage ? (
                          <Image
                            src={product.featuredImage.url}
                            alt={product.featuredImage.altText || product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full">
                            <div className="text-4xl">👕</div>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-mono text-xs uppercase line-clamp-1">
                          {product.title}
                        </h4>
                        <p className="font-bold mt-1">
                          {formatPrice(
                            product.priceRange.minVariantPrice.amount,
                            product.priceRange.minVariantPrice.currencyCode
                          )}
                        </p>
                      </div>
                    </div>
                  </QuickViewDialog>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                variant="outline"
                onClick={resetQuiz}
                className="flex-1"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                RETAKE QUIZ
              </Button>
              
              <Button
                className="flex-1"
                asChild
              >
                <Link href="/new">
                  VIEW ALL PRODUCTS
                </Link>
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

// Hook to use style quiz
export function useStyleQuiz() {
  const [isOpen, setIsOpen] = useState(false)

  const openQuiz = () => setIsOpen(true)
  const closeQuiz = () => setIsOpen(false)

  return {
    isOpen,
    openQuiz,
    closeQuiz,
    setIsOpen
  }
}