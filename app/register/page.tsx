import { Metadata } from 'next'
import { RegisterForm } from './register-form'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Create Account - Indecisive Wear',
  description: 'Create your Indecisive Wear account to start shopping',
}

export default async function RegisterPage() {

  return (
    <div className="min-h-screen flex">
      {/* Left side - Visual element (hidden on mobile) */}
      <div className="hidden lg:block lg:flex-1 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-800 to-gray-900 opacity-90" />
        <div className="relative h-full flex items-center justify-center p-12 text-white">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4">Join Our Community</h2>
            <p className="text-lg text-gray-300 mb-8">
              Get exclusive access to new collections, member-only discounts, 
              and personalized style recommendations.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-lg">✨</span>
                </div>
                <div>
                  <p className="font-medium">Early Access</p>
                  <p className="text-sm text-gray-400">Shop new arrivals before anyone else</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-lg">🎁</span>
                </div>
                <div>
                  <p className="font-medium">Member Benefits</p>
                  <p className="text-sm text-gray-400">Exclusive offers and birthday rewards</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Create an account</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Start your fashion journey with Indecisive Wear
            </p>
          </div>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <RegisterForm />

              <div className="mt-6 text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/login" className="font-medium text-gray-900 hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Link
              href="/"
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-900"
            >
              ← Back to shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}