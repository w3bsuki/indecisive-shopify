import { NewsletterFormClient } from './newsletter-form-client'

export async function NewsletterSection() {
  return (
    <section className="min-h-[300px] md:h-96 flex relative mb-16 md:mb-0">
      <div className="w-1/2 bg-white flex flex-col justify-center items-center px-3 sm:px-6 md:px-12 py-8 md:py-0">
        <div className="text-center space-y-3 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md w-full">
          <h3 className="text-lg sm:text-3xl md:text-4xl font-bold">STAY MINIMAL</h3>
          <p className="text-black/70 text-xs sm:text-base md:text-lg">Get updates on our essential pieces</p>
          <NewsletterFormClient 
            variant="light"
            buttonText="SUBSCRIBE"
            placeholder="Enter email"
          />
        </div>
      </div>

      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/20 transform -translate-x-px"></div>

      <div className="w-1/2 bg-black flex flex-col justify-center items-center px-3 sm:px-6 md:px-12 py-8 md:py-0">
        <div className="text-center space-y-3 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md w-full">
          <h3 className="text-lg sm:text-3xl md:text-4xl font-bold text-white">JOIN COMMUNITY</h3>
          <p className="text-white/70 text-xs sm:text-base md:text-lg">Share your style and get featured</p>
          <NewsletterFormClient 
            variant="dark"
            buttonText="JOIN NOW"
            placeholder="Enter email"
          />
        </div>
      </div>
    </section>
  )
}