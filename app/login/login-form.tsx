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
  if (state.error && !isPending) {
    toast.error(state.error)
  }

  return (
    <form action={formAction} className="space-y-6">
      {redirectTo && (
        <input type="hidden" name="redirectTo" value={redirectTo} />
      )}
      
      <div className="space-y-2">
        <Label htmlFor="email" className="font-mono">Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="pl-10 border-2 border-black"
            placeholder="your@email.com"
            disabled={isPending}
          />
        </div>
        {state.fieldErrors?.email && (
          <p className="text-sm text-red-600">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="font-mono">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            required
            className="pl-10 pr-10 border-2 border-black"
            placeholder="Enter your password"
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
            disabled={isPending}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {state.fieldErrors?.password && (
          <p className="text-sm text-red-600">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <Link
          href="/forgot-password"
          className="text-sm text-gray-600 hover:text-black font-mono"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full font-mono"
      >
        {isPending ? 'SIGNING IN...' : 'SIGN IN'}
      </Button>
    </form>
  )
}