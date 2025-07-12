'use client'

import type { AccountTab } from './types'

interface MobileAccountNavProps {
  activeTab: AccountTab
  onTabChange: (tab: AccountTab) => void
}

export function MobileAccountNav({ activeTab: _activeTab, onTabChange: _onTabChange }: MobileAccountNavProps) {
  return null // Mobile navigation is now handled by select dropdown in account-tabs.tsx
}