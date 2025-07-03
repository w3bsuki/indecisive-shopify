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
    <form action={formAction} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="font-mono">First Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="firstName"
              name="firstName"
              type="text"
              required
              className="pl-10 border-2 border-black"
              placeholder="John"
              disabled={isPending}
            />
          </div>
          {state.fieldErrors?.firstName && (
            <p className="text-sm text-red-600">{state.fieldErrors.firstName[0]}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName" className="font-mono">Last Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="lastName"
              name="lastName"
              type="text"
              required
              className="pl-10 border-2 border-black"
              placeholder="Doe"
              disabled={isPending}
            />
          </div>
          {state.fieldErrors?.lastName && (
            <p className="text-sm text-red-600">{state.fieldErrors.lastName[0]}</p>
          )}
        </div>
      </div>

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
            autoComplete="new-password"
            required
            className="pl-10 pr-10 border-2 border-black"
            placeholder="Minimum 8 characters"
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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="font-mono">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            autoComplete="new-password"
            required
            className="pl-10 pr-10 border-2 border-black"
            placeholder="Confirm your password"
            disabled={isPending}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-600"
            disabled={isPending}
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {state.fieldErrors?.confirmPassword && (
          <p className="text-sm text-red-600">{state.fieldErrors.confirmPassword[0]}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox id="acceptsMarketing" name="acceptsMarketing" disabled={isPending} />
        <Label htmlFor="acceptsMarketing" className="text-sm text-gray-600">
          Send me exclusive offers and updates
        </Label>
      </div>

      <div className="text-xs text-gray-600">
        <p>By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full font-mono"
      >
        {isPending ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
      </Button>
    </form>
  )
}