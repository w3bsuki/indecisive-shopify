import { Metadata } from 'next'
import { LoginForm } from './login-form'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Sign In - Indecisive Wear',
  description: 'Sign in to your Indecisive Wear account',
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const redirectTo = params.redirectTo as string | undefined

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-white">
        <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8">
          <div className="text-center sm:text-left">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Welcome back</h1>
            <p className="mt-2 text-sm sm:text-base text-gray-600">
              Sign in to your account to continue shopping
            </p>
          </div>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <LoginForm redirectTo={redirectTo} />

              <div className="mt-6 text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="font-medium text-gray-900 hover:underline">
                    Sign up
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

      {/* Right side - Visual element (hidden on mobile) */}
      <div className="hidden lg:block lg:flex-1 bg-gray-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black opacity-90" />
        <div className="relative h-full flex items-center justify-center p-12 text-white">
          <div className="max-w-md">
            <h2 className="text-4xl font-bold mb-4">Indecisive Wear</h2>
            <p className="text-lg text-gray-300">
              Discover unique fashion pieces that match your style. 
              Join our community of fashion enthusiasts.
            </p>
            <div className="mt-8 flex gap-8">
              <div>
                <p className="text-3xl font-bold">10K+</p>
                <p className="text-sm text-gray-400">Happy Customers</p>
              </div>
              <div>
                <p className="text-3xl font-bold">500+</p>
                <p className="text-sm text-gray-400">Unique Products</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}