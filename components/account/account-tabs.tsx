'use client'

import { useState, useEffect } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { User, Package, MapPin, CreditCard } from 'lucide-react'
import { ProfileSection } from './profile-section'
import { OrdersSection } from './orders-section'
import { AddressesSection } from './addresses-section'
import { BillingSection } from './billing-section'
import { MobileAccountNav } from './mobile-account-nav'
import { AccountOverview } from './account-overview'
import { getCurrentCustomer } from '@/app/actions/auth'
import type { AccountTab } from './types'
import type { Customer } from '@/lib/shopify/customer-auth'

export function AccountTabs() {
  const [activeTab, setActiveTab] = useState<AccountTab>('overview')
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [_isLoading, setIsLoading] = useState(true)

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
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 md:py-8">
      {/* Page Header */}
      <div className="mb-6 md:mb-10 text-center">
        <h1 className="text-2xl md:text-5xl font-extrabold font-mono mb-2 tracking-tight bg-gradient-to-r from-black via-gray-800 to-gray-500 bg-clip-text text-transparent drop-shadow-lg animate-gradient-x">
          MY ACCOUNT
        </h1>
        <p className="text-base md:text-lg text-gray-500 font-medium">
          Manage your profile, orders, and preferences
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as AccountTab)}>
        {/* Mobile Navigation */}
        <div className="block md:hidden mb-4">
          <MobileAccountNav activeTab={activeTab} onTabChange={setActiveTab} />
        </div>

        {/* Desktop Tabs */}
        <div className="hidden md:flex justify-center mb-8 md:mb-10">
          <TabsList className="flex w-full max-w-3xl rounded-2xl bg-white/95 shadow-lg border border-gray-200 overflow-hidden">
            <TabsTrigger value="overview" className="font-mono text-base py-4 flex-1 flex items-center justify-center gap-2 transition-colors data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:hover:bg-gray-100">
              <User className="w-5 h-5" />
              OVERVIEW
            </TabsTrigger>
            <TabsTrigger value="orders" className="font-mono text-base py-4 flex-1 flex items-center justify-center gap-2 transition-colors data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:hover:bg-gray-100">
              <Package className="w-5 h-5" />
              ORDERS
            </TabsTrigger>
            <TabsTrigger value="profile" className="font-mono text-base py-4 flex-1 flex items-center justify-center gap-2 transition-colors data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:hover:bg-gray-100">
              <User className="w-5 h-5" />
              PROFILE
            </TabsTrigger>
            <TabsTrigger value="addresses" className="font-mono text-base py-4 flex-1 flex items-center justify-center gap-2 transition-colors data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:hover:bg-gray-100">
              <MapPin className="w-5 h-5" />
              ADDRESSES
            </TabsTrigger>
            <TabsTrigger value="billing" className="font-mono text-base py-4 flex-1 flex items-center justify-center gap-2 transition-colors data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md data-[state=inactive]:hover:bg-gray-100">
              <CreditCard className="w-5 h-5" />
              BILLING
            </TabsTrigger>
          </TabsList>
        </div>

        {/* Content for both mobile and desktop */}
        <TabsContent value="overview">
          <AccountOverview customer={customer} onTabChange={(tab) => setActiveTab(tab)} />
        </TabsContent>

        <TabsContent value="profile">
          <ProfileSection customer={customer} />
        </TabsContent>

        <TabsContent value="orders">
          <OrdersSection customer={customer} />
        </TabsContent>

        <TabsContent value="addresses">
          <AddressesSection customer={customer} />
        </TabsContent>

        <TabsContent value="billing">
          <BillingSection customer={customer} />
        </TabsContent>
      </Tabs>
    </div>
  )
}