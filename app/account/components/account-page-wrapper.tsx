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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <AccountSidebar customer={customer} />
        </aside>
        
        {/* Main Content */}
        <section className="lg:col-span-3">
          {children}
        </section>
      </div>
    </div>
  )
}