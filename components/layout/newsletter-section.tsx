'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export function NewsletterSection() {
  return (
    <section className="min-h-[300px] md:h-96 flex relative mb-16 md:mb-0">
      <div className="w-1/2 bg-white flex flex-col justify-center items-center px-3 sm:px-6 md:px-12 py-8 md:py-0">
        <div className="text-center space-y-3 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md w-full">
          <h3 className="text-lg sm:text-3xl md:text-4xl font-bold">STAY MINIMAL</h3>
          <p className="text-black/70 text-xs sm:text-base md:text-lg">Get updates on our essential pieces</p>
          <form className="flex flex-col gap-2 sm:gap-4">
            <Input
              type="email"
              placeholder="Enter email"
              className="font-mono bg-black/5 focus:bg-black/10 focus:ring-0 text-xs sm:text-base md:text-lg px-3"
            />
            <Button type="submit" className="bg-black text-white hover:bg-black/80 font-mono text-xs sm:text-base md:text-lg py-3">
              SUBSCRIBE
            </Button>
          </form>
        </div>
      </div>

      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/20 transform -translate-x-px"></div>

      <div className="w-1/2 bg-black flex flex-col justify-center items-center px-3 sm:px-6 md:px-12 py-8 md:py-0">
        <div className="text-center space-y-3 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md w-full">
          <h3 className="text-lg sm:text-3xl md:text-4xl font-bold text-white">JOIN COMMUNITY</h3>
          <p className="text-white/70 text-xs sm:text-base md:text-lg">Share your style and get featured</p>
          <form className="flex flex-col gap-2 sm:gap-4">
            <Input
              type="email"
              placeholder="Enter email"
              className="font-mono bg-white/10 text-white placeholder:text-white/60 focus:bg-white/20 focus:ring-0 text-xs sm:text-base md:text-lg px-3"
            />
            <Button type="submit" className="bg-white text-black hover:bg-white/90 font-mono text-xs sm:text-base md:text-lg py-3">
              JOIN NOW
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}