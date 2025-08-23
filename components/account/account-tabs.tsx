'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Package, MapPin, CreditCard, LayoutDashboard } from 'lucide-react'
import { ProfileSection } from './profile-section'
import { OrdersSection } from './orders-section'
import { AddressesSection } from './addresses-section'
import { BillingSection } from './billing-section'
import { AccountOverview } from './account-overview'
import { getCurrentCustomer } from '@/app/actions/auth'
import type { AccountTab } from './types'
import type { Customer } from '@/lib/shopify/customer-auth'

const tabs = [
  { id: 'overview' as AccountTab, label: 'Overview', icon: LayoutDashboard },
  { id: 'orders' as AccountTab, label: 'Orders', icon: Package },
  { id: 'profile' as AccountTab, label: 'Profile', icon: User },
  { id: 'addresses' as AccountTab, label: 'Addresses', icon: MapPin },
  { id: 'billing' as AccountTab, label: 'Settings', icon: CreditCard }
]

export function AccountTabs() {
  const [activeTab, setActiveTab] = useState<AccountTab>('overview')
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadCustomer = async () => {
      try {
        const customerData = await getCurrentCustomer()
        setCustomer(customerData)
      } catch (error) {
        console.error('Failed to load customer:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCustomer()
  }, [])

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Account</h1>
        <p className="text-gray-600">Manage your account settings, orders, and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AccountTab)}>
        {/* Desktop Navigation - Modern Pills */}
        <div className="hidden md:block mb-8">
          <TabsList className="h-auto p-1 bg-gray-100 rounded-2xl justify-start gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="px-6 py-3 text-sm font-medium rounded-xl data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-gray-900 text-gray-600 hover:text-gray-900 transition-all duration-200"
                >
                  <Icon className="h-4 w-4 mr-2 inline-block" />
                  {tab.label}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {/* Mobile Navigation - Modern Select */}
        <div className="md:hidden mb-6">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as AccountTab)}
            className="w-full px-4 py-3 text-sm font-medium border-2 border-gray-200 rounded-xl bg-white focus:border-gray-900 focus:outline-none transition-colors"
          >
            {tabs.map((tab) => (
              <option key={tab.id} value={tab.id}>
                {tab.label}
              </option>
            ))}
          </select>
        </div>

        {/* Tab Content */}
        <div>
          <TabsContent value="overview" className="mt-0">
            <AccountOverview customer={customer} onTabChange={setActiveTab} />
          </TabsContent>

          <TabsContent value="profile" className="mt-0">
            <ProfileSection customer={customer} />
          </TabsContent>

          <TabsContent value="orders" className="mt-0">
            <OrdersSection customer={customer} />
          </TabsContent>

          <TabsContent value="addresses" className="mt-0">
            <AddressesSection customer={customer} />
          </TabsContent>

          <TabsContent value="billing" className="mt-0">
            <BillingSection customer={customer} />
          </TabsContent>
        </div>
      </Tabs>

      {/* Loading State */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
            <div className="h-8 w-8 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-gray-600 font-medium">Loading your account...</p>
          </div>
        </div>
      )}
    </div>
  )
}