'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { registerAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react'
import { toast } from 'sonner'

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [state, formAction, isPending] = useActionState(registerAction, {})

  // Show error toast if there's an error
  if (state.error && !isPending) {
    toast.error(state.error)
  }

  return (
    <form action={formAction} className="space-y-3 sm:space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="firstName" className="text-sm sm:text-base">First Name</Label>
          <div className="relative">
            <User className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
              placeholder="John"
              disabled={isPending}
            />
          </div>
          {state.fieldErrors?.firstName && (
            <p className="text-xs sm:text-sm text-red-600">{state.fieldErrors.firstName[0]}</p>
          )}
        </div>

        <div className="space-y-1.5 sm:space-y-2">
          <Label htmlFor="lastName" className="text-sm sm:text-base">Last Name</Label>
          <div className="relative">
            <User className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="pl-8 sm:pl-10 h-9 sm:h-10 text-sm sm:text-base"
              placeholder="Doe"
              disabled={isPending}
            />
          </div>
          {state.fieldErrors?.lastName && (
            <p className="text-xs sm:text-sm text-red-600">{state.fieldErrors.lastName[0]}</p>
          )}
        </div>
      </div>

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
            autoComplete="new-password"
            required
            className="pl-8 sm:pl-10 pr-8 sm:pr-10 h-9 sm:h-10 text-sm sm:text-base"
            placeholder="Minimum 8 characters"
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

      <div className="space-y-1.5 sm:space-y-2">
        <Label htmlFor="confirmPassword" className="text-sm sm:text-base">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-2.5 top-2.5 sm:left-3 sm:top-3 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            className="pl-8 sm:pl-10 pr-8 sm:pr-10 h-9 sm:h-10 text-sm sm:text-base"
            placeholder="Confirm your password"
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-2.5 top-2.5 sm:right-3 sm:top-3 text-gray-400 hover:text-gray-600"
            disabled={isPending}
          >
            {showConfirmPassword ? <EyeOff className="h-3 w-3 sm:h-4 sm:w-4" /> : <Eye className="h-3 w-3 sm:h-4 sm:w-4" />}
          </button>
        </div>
        {state.fieldErrors?.confirmPassword && (
          <p className="text-xs sm:text-sm text-red-600">{state.fieldErrors.confirmPassword[0]}</p>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Checkbox id="acceptsMarketing" name="acceptsMarketing" disabled={isPending} className="h-3 w-3 sm:h-4 sm:w-4" />
          <Label htmlFor="acceptsMarketing" className="text-xs sm:text-sm text-gray-600 cursor-pointer">
            Send me exclusive offers and updates
          </Label>
        </div>

        <div className="text-xs text-gray-500">
          <p>By creating an account, you agree to our{' '}
            <a href="/terms" className="underline hover:text-gray-700">Terms of Service</a> and{' '}
            <a href="/privacy" className="underline hover:text-gray-700">Privacy Policy</a>.
          </p>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full h-10 sm:h-11 text-sm sm:text-base"
      >
        {isPending ? 'Creating account...' : 'Create account'}
      </Button>
    </form>
  )
}