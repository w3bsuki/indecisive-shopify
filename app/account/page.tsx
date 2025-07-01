import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { User, Package, Heart, MapPin, CreditCard, LogOut } from 'lucide-react'
import Link from 'next/link'

export const metadata = {
  title: 'My Account | Indecisive Wear',
  description: 'Manage your account, orders, and preferences at Indecisive Wear.',
}

export default function AccountPage() {
  // TODO: Implement Shopify customer authentication
  const isAuthenticated = false

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold font-mono mb-8 text-center">ACCOUNT LOGIN</h1>
        
        <div className="space-y-8">
          {/* Login Form */}
          <div className="border-2 border-black p-6">
            <h2 className="text-xl font-bold font-mono mb-4">SIGN IN</h2>
            <form className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="you@example.com"
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input 
                  id="password" 
                  type="password"
                  className="font-mono" 
                />
              </div>
              <div className="flex justify-between text-sm">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="rounded border-gray-300" />
                  Remember me
                </label>
                <Link href="/account/forgot-password" className="underline">
                  Forgot password?
                </Link>
              </div>
              <Button className="w-full font-mono" size="lg">
                SIGN IN
              </Button>
            </form>
          </div>

          {/* Register Form */}
          <div className="border-2 border-black p-6">
            <h2 className="text-xl font-bold font-mono mb-4">CREATE ACCOUNT</h2>
            <p className="text-gray-600 mb-4">
              Join to track orders, save favorites, and get exclusive offers.
            </p>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    className="font-mono"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="registerEmail">Email</Label>
                <Input 
                  id="registerEmail" 
                  type="email" 
                  placeholder="you@example.com"
                  className="font-mono"
                />
              </div>
              <div>
                <Label htmlFor="registerPassword">Password</Label>
                <Input 
                  id="registerPassword" 
                  type="password"
                  className="font-mono" 
                />
              </div>
              <Button className="w-full font-mono" size="lg">
                CREATE ACCOUNT
              </Button>
            </form>
          </div>
        </div>
      </div>
    )
  }

  // Authenticated Account Dashboard
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold font-mono mb-8">MY ACCOUNT</h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Navigation */}
        <aside className="lg:col-span-1">
          <nav className="space-y-2">
            <Link href="/account" className="flex items-center gap-3 p-3 bg-black text-white font-mono">
              <User className="w-5 h-5" />
              PROFILE
            </Link>
            <Link href="/account/orders" className="flex items-center gap-3 p-3 hover:bg-gray-100 font-mono">
              <Package className="w-5 h-5" />
              ORDERS
            </Link>
            <Link href="/account/wishlist" className="flex items-center gap-3 p-3 hover:bg-gray-100 font-mono">
              <Heart className="w-5 h-5" />
              WISHLIST
            </Link>
            <Link href="/account/addresses" className="flex items-center gap-3 p-3 hover:bg-gray-100 font-mono">
              <MapPin className="w-5 h-5" />
              ADDRESSES
            </Link>
            <Link href="/account/payment" className="flex items-center gap-3 p-3 hover:bg-gray-100 font-mono">
              <CreditCard className="w-5 h-5" />
              PAYMENT
            </Link>
            <button className="flex items-center gap-3 p-3 hover:bg-gray-100 font-mono w-full text-left text-red-600">
              <LogOut className="w-5 h-5" />
              LOGOUT
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          <div className="border-2 border-black p-6">
            <h2 className="text-xl font-bold font-mono mb-6">PROFILE INFORMATION</h2>
            
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    defaultValue="John"
                    className="font-mono"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    defaultValue="Doe"
                    className="font-mono"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  defaultValue="john.doe@example.com"
                  className="font-mono"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="font-mono"
                />
              </div>

              <div>
                <h3 className="font-bold mb-2">Email Preferences</h3>
                <div className="space-y-2">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    Order updates
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    New arrivals & promotions
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="rounded border-gray-300" />
                    Style tips & lookbooks
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="font-mono">
                  SAVE CHANGES
                </Button>
                <Button variant="outline" className="font-mono">
                  CHANGE PASSWORD
                </Button>
              </div>
            </form>
          </div>

          {/* Recent Orders Preview */}
          <div className="mt-8 border-2 border-black p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold font-mono">RECENT ORDERS</h2>
              <Link href="/account/orders" className="text-sm underline">
                View all
              </Link>
            </div>
            <p className="text-gray-600">No recent orders to display.</p>
          </div>
        </main>
      </div>
    </div>
  )
}