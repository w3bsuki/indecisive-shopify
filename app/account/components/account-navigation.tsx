'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function AccountNavigation() {
  return (
    <Card className="border-2 border-black">
      <CardHeader className="pb-3">
        <CardTitle className="font-mono text-lg">Navigation</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <nav className="space-y-1">
          {/* Navigation items are now handled by the shadcn/ui Tabs in AccountTabs */}
        </nav>
      </CardContent>
    </Card>
  )
}

// This component is now deprecated and should not be used in the new account UI.