import { Button } from '@/components/ui/button'

export function HeroSection() {
  return (
    <section className="pt-20 md:pt-20 h-screen flex relative">
      <div className="w-1/2 bg-white flex flex-col justify-center items-center px-2 sm:px-6 md:px-12 py-8 md:py-20">
        <div className="text-center space-y-3 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md">
          <h1 className="text-xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
            CAN'T
            <br />
            DECIDE?
          </h1>
          <p className="text-[10px] sm:text-sm md:text-lg text-black/80 leading-relaxed">Minimalist essentials</p>
          <Button className="bg-black text-white hover:bg-black/80 px-4 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-xs sm:text-base font-mono font-medium">
            SHOP ESSENTIALS
          </Button>
        </div>
      </div>

      <div className="absolute left-1/2 top-20 md:top-20 bottom-0 w-px bg-black/20 transform -translate-x-px"></div>

      <div className="w-1/2 bg-black flex flex-col justify-center items-center px-2 sm:px-6 md:px-12 py-8 md:py-20">
        <div className="text-center space-y-3 sm:space-y-6 md:space-y-8 max-w-xs sm:max-w-sm md:max-w-md">
          <h1 className="text-xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-white">
            CHOOSE
            <br />
            CHAOS
          </h1>
          <p className="text-[10px] sm:text-sm md:text-lg text-white/80 leading-relaxed">Urban streetwear</p>
          <Button className="bg-white text-black hover:bg-white/90 px-4 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 text-xs sm:text-base font-mono font-medium">
            SHOP STREETWEAR
          </Button>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-black text-white py-2 sm:py-4 md:py-5 overflow-hidden" role="marquee" aria-label="Scrolling brand message">
        <div className="flex animate-marquee whitespace-nowrap" aria-hidden="true">
          {[...Array(4)].map((_, i) => (
            <span key={i} className="flex">
              <span className="text-xs sm:text-base md:text-lg lg:text-xl font-mono font-bold tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] mx-3 sm:mx-6 md:mx-8">
                INDECISIVE WEAR
              </span>
              <span className="text-xs sm:text-base md:text-lg lg:text-xl font-mono font-bold tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] mx-3 sm:mx-6 md:mx-8">
                CHOOSE BOTH SIDES
              </span>
              <span className="text-xs sm:text-base md:text-lg lg:text-xl font-mono font-bold tracking-[0.2em] sm:tracking-[0.3em] md:tracking-[0.4em] mx-3 sm:mx-6 md:mx-8">
                MINIMAL + MAXIMAL
              </span>
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}