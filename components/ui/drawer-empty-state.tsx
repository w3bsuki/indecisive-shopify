import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { LucideIcon } from 'lucide-react'

interface DrawerEmptyStateProps {
  icon: LucideIcon
  title: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
  className?: string
}

export function DrawerEmptyState({ 
  icon: Icon, 
  title, 
  subtitle, 
  actionLabel, 
  onAction,
  className 
}: DrawerEmptyStateProps) {
  return (
    <div className={cn('drawer-empty-state', className)}>
      <Icon className="drawer-empty-icon" />
      <h3 className="text-empty-title mb-2">{title}</h3>
      {subtitle && (
        <p className="text-empty-subtitle mb-6">{subtitle}</p>
      )}
      {actionLabel && onAction && (
        <Button 
          onClick={onAction}
          className="drawer-button-secondary max-w-xs"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  )
}