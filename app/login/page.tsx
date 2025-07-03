import { Metadata } from 'next'
import { LoginForm } from './login-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
    <div className="h-screen-dynamic flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-mono tracking-tight">SIGN IN</h1>
          <p className="mt-2 text-gray-600">Welcome back to Indecisive Wear</p>
        </div>

        <Card className="border-2 border-black">
          <CardHeader>
            <CardTitle className="font-mono">Login to your account</CardTitle>
            <CardDescription>
              Enter your email and password to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LoginForm redirectTo={redirectTo} />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link href="/register" className="font-mono text-black hover:underline">
                  Create one here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-gray-600 hover:text-black font-mono"
          >
            ← Back to shopping
          </Link>
        </div>
      </div>
    </div>
  )
}