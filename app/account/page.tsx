import { Metadata } from 'next'
import { getCurrentCustomer } from '@/app/actions/auth'
import { getCustomerToken } from '@/lib/auth/token'
import { redirect } from 'next/navigation'
import UserAccountSystem from '@/components/ui/user-account-system'

export const metadata: Metadata = {
  title: 'My Account - Indecisive Wear',
  description: 'Manage your account, orders, and preferences',
}

export default async function AccountDashboardPage() {
  const customer = await getCurrentCustomer()
  const token = await getCustomerToken()
  
  if (!customer || !token) {
    redirect('/login')
  }

  return <UserAccountSystem />
}