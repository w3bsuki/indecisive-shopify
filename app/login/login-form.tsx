'use client'

import { useState, useEffect } from 'react'
import { useActionState } from 'react'
import { loginAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { analytics } from '@/lib/analytics/events'

interface LoginFormProps {
  redirectTo?: string
}

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction, isPending] = useActionState(loginAction, {})

  // Track successful login
  useEffect(() => {
    if (state.success) {
      analytics.login('email')
    }
  }, [state.success])

  // Show error toast if there's an error
  useEffect(() => {
    if (state.error && !isPending) {
      toast.error(state.error)
    }
  }, [state.error, isPending])

  const handleLogin = () => {
    const email = (document.getElementById('email') as HTMLInputElement)?.value
    const password = (document.getElementById('password') as HTMLInputElement)?.value
    
    if (email && password) {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      if (redirectTo) {
        formData.append('redirectTo', redirectTo)
      }
      formAction(formData)
    }
  }

  return (
    <div id="login-form" className="space-y-6">
      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}
      
      {state.error && (
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm font-medium">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            {state.error}
          </div>
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email" className="text-sm font-semibold text-gray-900">Email address</Label>
        <div className="relative">
          <Mail className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="pl-12 h-14 rounded-xl border-2 border-gray-200 focus:border-gray-900 text-base transition-colors"
            placeholder="your@email.com"
            disabled={isPending}
          />
        </div>
        {state.fieldErrors?.email && (
          <p className="text-sm text-red-600 font-medium">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-sm font-semibold text-gray-900">Password</Label>
        <div className="relative">
          <Lock className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            className="pl-12 pr-12 h-14 rounded-xl border-2 border-gray-200 focus:border-gray-900 text-base transition-colors"
            placeholder="Enter your password"
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isPending}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {state.fieldErrors?.password && (
          <p className="text-sm text-red-600 font-medium">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900 focus:ring-2"
          />
          <label htmlFor="remember-me" className="ml-3 block text-sm font-medium text-gray-700">
            Remember me
          </label>
        </div>
        <Link
          href="/forgot-password"
          className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="button"
        disabled={isPending}
        className="w-full h-14 rounded-xl bg-gray-900 hover:bg-gray-800 text-base font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
        onClick={handleLogin}
      >
        {isPending ? (
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            Signing in...
          </div>
        ) : (
          'Sign in to your account'
        )}
      </Button>
    </div>
  )
}