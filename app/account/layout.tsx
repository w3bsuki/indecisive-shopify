import { getCurrentCustomer } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'
import { PersistentAccountBottomNav } from '@/components/account/persistent-account-bottom-nav'

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Ensure user is authenticated
  const customer = await getCurrentCustomer()
  
  if (!customer) {
    redirect('/login?redirectTo=/account')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 flex flex-col">
      {/* Main Navigation */}
      <Navigation />
      {/* Account Content */}
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </div>
        {/* Persistent bottom nav for mobile */}
        <PersistentAccountBottomNav />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  )
}