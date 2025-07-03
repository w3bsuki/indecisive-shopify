'use client'

import { useState } from 'react'
import { useActionState } from 'react'
import { recoverPasswordAction } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { Key, Mail, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'

interface PasswordResetSectionProps {
  customerEmail: string
}

export function PasswordResetSection({ customerEmail }: PasswordResetSectionProps) {
  const [state, formAction, isPending] = useActionState(recoverPasswordAction, {})
  const [emailSent, setEmailSent] = useState(false)

  // Handle success state
  if (state.success && !isPending && !emailSent) {
    setEmailSent(true)
    toast.success('Password reset email sent! Check your inbox.')
  }

  // Handle error state
  if (state.error && !isPending) {
    toast.error(state.error)
  }

  if (emailSent) {
    return (
      <div className="border-2 border-green-300 bg-green-50 p-4 rounded">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <h4 className="font-mono font-medium text-green-800">Reset Email Sent</h4>
        </div>
        <p className="text-sm text-green-700 mb-3">
          We&apos;ve sent a password reset link to <strong>{customerEmail}</strong>. 
          Check your inbox and follow the instructions to reset your password.
        </p>
        <p className="text-xs text-green-600 mb-3">
          The link will expire in 24 hours for security reasons.
        </p>
        <Button 
          variant="outline" 
          size="sm" 
          className="font-mono border-green-300 text-green-700 hover:bg-green-100"
          onClick={() => setEmailSent(false)}
        >
          Send Another Email
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 border-2 border-gray-200 bg-gray-50 rounded">
        <AlertCircle className="h-4 w-4 text-blue-600" />
        <div className="text-sm">
          <p className="font-medium">Password Reset via Email</p>
          <p className="text-gray-600">
            For security, password changes are handled through email verification.
          </p>
        </div>
      </div>

      <form action={formAction} className="space-y-3">
        {/* Hidden email field with customer's email */}
        <input type="hidden" name="email" value={customerEmail} />
        
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-gray-500" />
          <span className="text-sm">Reset link will be sent to: <strong>{customerEmail}</strong></span>
        </div>

        <Button
          type="submit"
          disabled={isPending}
          className="font-mono"
          size="sm"
        >
          {isPending ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              SENDING EMAIL...
            </>
          ) : (
            <>
              <Key className="h-4 w-4 mr-2" />
              SEND RESET EMAIL
            </>
          )}
        </Button>
      </form>

      <div className="text-xs text-gray-600 space-y-1">
        <p>• Check your spam folder if you don&apos;t see the email</p>
        <p>• The reset link will expire in 24 hours</p>
        <p>• You can request a new reset email if needed</p>
      </div>
    </div>
  )
}