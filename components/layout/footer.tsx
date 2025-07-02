import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()
  
  return (
    <footer className="bg-white border-t border-black/10 py-8 md:py-20">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-12">
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4 md:mb-8">
              <div className="flex items-center space-x-1">
                <div className="w-4 h-4 bg-black"></div>
                <div className="w-4 h-4 bg-white border border-gray-950"></div>
              </div>
              <span className="font-mono font-bold text-sm">INDECISIVE WEAR</span>
            </div>
            <p className="text-black/70 text-sm leading-relaxed">
              For the beautifully undecided. Embrace both sides of your style.
            </p>
          </div>

          {[
            { title: "SHOP", links: ["New Arrivals", "Essentials", "Streetwear", "Sale"] },
            { title: "SUPPORT", links: ["Size Guide", "Shipping", "Returns", "Contact"] },
            { title: "CONNECT", links: ["Instagram", "Twitter", "TikTok", "Newsletter"] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="font-mono font-bold mb-4 md:mb-8 text-sm uppercase tracking-wider">{col.title}</h4>
              <ul className="space-y-2 md:space-y-4 text-sm text-black/70">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="hover:text-black">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-black/10 mt-8 md:mt-16 pt-6 text-center text-xs sm:text-base text-black/60">
          <p>
            &copy; {currentYear} Indecisive Wear. All rights reserved. | 
            <Link href="/privacy-policy" className="hover:text-black mx-1">Privacy Policy</Link> | 
            <Link href="/cookie-policy" className="hover:text-black mx-1">Cookie Policy</Link> | 
            <Link href="/terms" className="hover:text-black ml-1">Terms of Service</Link>
          </p>
        </div>
      </div>
    </footer>
  )
}