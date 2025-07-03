'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Trash2, Star, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteAddressAction, setDefaultAddressAction } from '@/app/actions/addresses'

interface AddressActionButtonsProps {
  addressId: string
  isDefault: boolean
  addressName: string
}

export function AddressActionButtons({ 
  addressId, 
  isDefault, 
  addressName 
}: AddressActionButtonsProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [isSettingDefault, setIsSettingDefault] = useState(false)

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await deleteAddressAction(addressId)
      toast.success('Address deleted successfully')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete address')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleSetDefault = async () => {
    setIsSettingDefault(true)
    try {
      await setDefaultAddressAction(addressId)
      toast.success('Default address updated')
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to set default address')
    } finally {
      setIsSettingDefault(false)
    }
  }

  return (
    <>
      {!isDefault && (
        <Button 
          variant="outline" 
          size="sm" 
          className="font-mono border-2 border-black"
          onClick={handleSetDefault}
          disabled={isSettingDefault}
        >
          {isSettingDefault ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              <Star className="h-4 w-4 mr-2" />
              Set Default
            </>
          )}
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button 
            variant="outline" 
            size="sm" 
            className="font-mono border-2 border-red-300 text-red-600 hover:bg-red-50"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </AlertDialogTrigger>
        
        <AlertDialogContent className="border-2 border-black">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-mono">Delete Address</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the address for <strong>{addressName}</strong>? 
              This action cannot be undone.
              {isDefault && (
                <span className="block mt-2 text-orange-600 font-medium">
                  ⚠️ This is your default address. You&apos;ll need to set a new default if you have other addresses.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel className="font-mono">Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              className="font-mono bg-red-600 hover:bg-red-700"
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Address'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}