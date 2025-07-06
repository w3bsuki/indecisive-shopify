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
      {/* Account Content - Beautiful card, shadow, rounded, max width, centered */}
      <main className="flex-1 flex flex-col items-center justify-start pt-4 px-1 sm:px-2 pb-24">
        <div className="w-full max-w-4xl bg-white/95 rounded-2xl shadow-xl border border-gray-200 p-2 sm:p-6 md:p-12 mt-0 mb-4 animate-fade-in transition-all duration-300">
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