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
    <div className="max-w-6xl mx-auto">
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AccountTab)}>
        {/* Desktop Navigation */}
        <div className="hidden md:block mb-6 border-b">
          <TabsList className="h-auto p-0 bg-transparent rounded-none justify-start">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <TabsTrigger
                  key={tab.id}
                  value={tab.id}
                  className="relative px-6 py-4 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-foreground data-[state=active]:bg-transparent transition-all"
                >
                  <Icon className="h-4 w-4 mr-2 inline-block" />
                  {tab.label}
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {/* Mobile Navigation - Select Dropdown */}
        <div className="md:hidden mb-6">
          <select
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value as AccountTab)}
            className="w-full px-4 py-3 text-sm font-medium border rounded-lg"
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
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="text-center">
            <div className="h-8 w-8 border-2 border-muted border-t-foreground rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">Loading your account...</p>
          </div>
        </div>
      )}
    </div>
  )
}