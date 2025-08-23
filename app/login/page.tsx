import { Metadata } from 'next'
import { LoginForm } from './login-form'
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
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="max-w-sm sm:max-w-md w-full space-y-6 sm:space-y-8">
          <div className="text-center sm:text-left">
            <div className="mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-gray-900 to-gray-700 rounded-2xl flex items-center justify-center mx-auto sm:mx-0 mb-4">
                <span className="text-white font-bold text-xl">IW</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Welcome back</h1>
              <p className="mt-3 text-base text-gray-600">
                Sign in to your account to continue your fashion journey
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-xl p-6 sm:p-8">
            <LoginForm redirectTo={redirectTo} />

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-semibold text-gray-900 hover:underline transition-colors">
                  Sign up for free
                </Link>
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Right side - Visual element (hidden on mobile) */}
      <div className="hidden lg:block lg:flex-1 bg-gradient-to-br from-gray-900 via-gray-800 to-black relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10" />
        <div className="relative h-full flex items-center justify-center p-12 text-white">
          <div className="max-w-lg text-center">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-8">
              <span className="text-white font-bold text-2xl">IW</span>
            </div>
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Indecisive Wear
            </h2>
            <p className="text-xl text-gray-300 leading-relaxed mb-12">
              Discover unique fashion pieces that match your style. 
              Join our community of fashion enthusiasts and express your individuality.
            </p>
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <p className="text-4xl font-bold mb-2">10K+</p>
                <p className="text-sm text-gray-400 uppercase tracking-wider">Happy Customers</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold mb-2">500+</p>
                <p className="text-sm text-gray-400 uppercase tracking-wider">Unique Products</p>
              </div>
              <div className="text-center">
                <p className="text-4xl font-bold mb-2">24/7</p>
                <p className="text-sm text-gray-400 uppercase tracking-wider">Support</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-xl" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-white/5 rounded-full blur-xl" />
      </div>
    </div>
  )
}