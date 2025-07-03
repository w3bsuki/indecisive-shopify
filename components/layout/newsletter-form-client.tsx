'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface NewsletterFormProps {
  variant: 'light' | 'dark'
  buttonText: string
  placeholder: string
}

export function NewsletterFormClient({ variant, buttonText, placeholder }: NewsletterFormProps) {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Newsletter subscription placeholder - replace with actual implementation
    // Could integrate with services like Mailchimp, ConvertKit, or custom backend
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setEmail('')
    setIsSubmitting(false)
  }

  const inputClass = variant === 'light' 
    ? "font-mono bg-black/5 focus:bg-black/10 focus:ring-0 text-xs sm:text-base md:text-lg px-3"
    : "font-mono bg-white/10 text-white placeholder:text-white/60 focus:bg-white/20 focus:ring-0 text-xs sm:text-base md:text-lg px-3"

  const buttonClass = variant === 'light'
    ? "bg-black text-white hover:bg-black/80 font-mono text-xs sm:text-base md:text-lg py-3"
    : "bg-white text-black hover:bg-white/90 font-mono text-xs sm:text-base md:text-lg py-3"

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 sm:gap-4">
      <Input
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className={inputClass}
        required
        disabled={isSubmitting}
      />
      <Button 
        type="submit" 
        className={buttonClass}
        disabled={isSubmitting}
      >
        {isSubmitting ? 'SUBMITTING...' : buttonText}
      </Button>
    </form>
  )
}