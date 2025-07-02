import { DesktopNavigation } from '@/components/layout/desktop-navigation'
import { MobileNavigation } from '@/components/layout/mobile-navigation'
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav'
import { Footer } from '@/components/layout/footer'

export default function ShopLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Navigation */}
      <DesktopNavigation />
      
      {/* Enhanced Mobile Navigation */}
      <MobileNavigation />

      {/* Mobile Bottom Navigation */}
      <MobileBottomNav />

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}