import { getCurrentCustomer } from '@/app/actions/auth'
import { redirect } from 'next/navigation'
import { AccountSidebar } from './components/account-sidebar'
import { AccountBreadcrumb } from './components/account-breadcrumb'

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
    <div className="min-h-screen-dynamic bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold font-mono">MY ACCOUNT</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {customer.displayName || customer.firstName || customer.email}
          </p>
        </div>

        {/* Breadcrumb */}
        <AccountBreadcrumb />

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <AccountSidebar customer={customer} />
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}