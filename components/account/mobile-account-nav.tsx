'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { User, Package, MapPin, CreditCard, LayoutDashboard, ChevronUp } from 'lucide-react'
import type { AccountTab } from './types'

interface MobileAccountNavProps {
  activeTab: AccountTab
  onTabChange: (tab: AccountTab) => void
}

const tabs = [
  { id: 'overview' as AccountTab, label: 'Overview', icon: LayoutDashboard },
  { id: 'orders' as AccountTab, label: 'Orders', icon: Package },
  { id: 'profile' as AccountTab, label: 'Profile', icon: User },
  { id: 'addresses' as AccountTab, label: 'Addresses', icon: MapPin },
  { id: 'billing' as AccountTab, label: 'Billing', icon: CreditCard },
]

export function MobileAccountNav({ activeTab, onTabChange }: MobileAccountNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const activeTabData = tabs.find(tab => tab.id === activeTab)
  const ActiveIcon = activeTabData?.icon || User

  const handleTabChange = (tab: AccountTab) => {
    onTabChange(tab)
    setIsOpen(false)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between font-mono border border-gray-300 hover:border-gray-400 h-14 px-4"
        >
          <div className="flex items-center">
            <ActiveIcon className="w-4 h-4 mr-3" />
            {activeTabData?.label.toUpperCase()}
          </div>
          <ChevronUp className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="h-[60vh] border-t border-gray-200">
        <SheetHeader className="pb-6">
          <SheetTitle className="font-mono text-center">ACCOUNT SECTIONS</SheetTitle>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-3">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            
            return (
              <Button
                key={tab.id}
                variant={isActive ? "default" : "outline"}
                className={`h-20 flex flex-col gap-2 font-mono border ${
                  isActive 
                    ? 'bg-gray-900 text-white border-gray-900' 
                    : 'border-gray-300 hover:bg-gray-50 hover:border-gray-400'
                }`}
                onClick={() => handleTabChange(tab.id)}
              >
                <Icon className="w-6 h-6" />
                <span className="text-xs">{tab.label.toUpperCase()}</span>
              </Button>
            )
          })}
        </div>
      </SheetContent>
    </Sheet>
  )
}