'use client'

import { UserMenu } from './user-menu'

interface ClientUserMenuProps {
  variant?: 'default' | 'header'
}

export function ClientUserMenu({ variant = 'default' }: ClientUserMenuProps) {
  return <UserMenu variant={variant} />
} 