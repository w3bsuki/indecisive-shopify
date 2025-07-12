import { getCurrentCustomer } from '@/app/actions/auth'
import { AccountSidebar } from './account-sidebar'

interface AccountPageWrapperProps {
  children: React.ReactNode
}

export async function AccountPageWrapper({ children }: AccountPageWrapperProps) {
  const customer = await getCurrentCustomer()
  
  if (!customer) {
    return null
  }

  return (
    <div className="px-0 sm:px-4 md:px-6 py-0 sm:py-4 md:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
        {/* Sidebar - Hidden on mobile, shown as bottom nav instead */}
        <aside className="hidden lg:block lg:col-span-1">
          <AccountSidebar customer={customer} />
        </aside>
        
        {/* Main Content - Full width on mobile */}
        <section className="lg:col-span-3 w-full">
          {children}
        </section>
      </div>
    </div>
  )
}