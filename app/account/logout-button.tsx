'use client'

import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/components/providers/auth-provider'
import { useState } from 'react'

export function AccountLogoutButton() {
  const { logout } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button 
      variant="outline" 
      className="w-full justify-start border-2 border-black text-red-600 hover:bg-red-50 h-12"
      onClick={handleLogout}
      disabled={isLoading}
    >
      <LogOut className="h-5 w-5 mr-3 flex-shrink-0" />
      {isLoading ? 'Logging out...' : 'Logout'}
    </Button>
  )
}