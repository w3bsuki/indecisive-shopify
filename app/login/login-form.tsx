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
    <div id="login-form" className="space-y-4 sm:space-y-5">
      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}
      
      {state.error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded-md text-xs sm:text-sm">
          {state.error}
        </div>
      )}
      
      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="email" className="text-sm sm:text-base">Email</Label>
        <div className="relative">
          <Mail className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
            placeholder="your@email.com"
            disabled={isPending}
          />
        </div>
        {state.fieldErrors?.email && (
          <p className="text-xs sm:text-sm text-red-600">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="password" className="text-sm sm:text-base">Password</Label>
        <div className="relative">
          <Lock className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            className="pl-8 sm:pl-10 pr-8 sm:pr-10 h-9 sm:h-10 text-sm sm:text-base"
            placeholder="Enter your password"
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3 text-gray-400 hover:text-gray-600"
            disabled={isPending}
          >
            {showPassword ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4" />}
          </button>
        </div>
        {state.fieldErrors?.password && (
          <p className="text-xs sm:text-sm text-red-600">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-3 w-3 sm:h-4 sm:w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
          />
          <label htmlFor="remember-me" className="ml-2 block text-xs sm:text-sm text-gray-900">
            Remember me
          </label>
        </div>
        <Link
          href="/forgot-password"
          className="text-xs sm:text-sm text-gray-600 hover:text-gray-900"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="button"
        disabled={isPending}
        className="w-full h-10 sm:h-11 text-sm sm:text-base"
        onClick={handleLogin}
      >
        {isPending ? 'Signing in...' : 'Sign in'}
      </Button>
    </div>
  )
}