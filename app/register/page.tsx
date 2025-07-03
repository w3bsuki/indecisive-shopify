import { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { RegisterForm } from './register-form'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Create Account - Indecisive Wear',
  description: 'Create your Indecisive Wear account to start shopping',
}

export default async function RegisterPage() {
  const t = await getTranslations('auth')

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold font-mono tracking-tight">{t('register.title')}</h1>
          <p className="mt-2 text-gray-600">{t('register.subtitle')}</p>
        </div>

        <Card className="border-2 border-black">
          <CardHeader>
            <CardTitle className="font-mono">{t('register.cardTitle')}</CardTitle>
            <CardDescription>
              {t('register.cardDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-mono text-black hover:underline">
                  Sign in here
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