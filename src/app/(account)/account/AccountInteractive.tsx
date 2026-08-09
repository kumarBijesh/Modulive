'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { logoutAction } from '@/actions/auth-actions'
import { LogOut } from 'lucide-react'

export function AccountInteractive() {
  const router = useRouter()

  const handleLogout = async () => {
    await logoutAction()
    router.push('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="inline-flex items-center gap-2 px-5 py-2.5 border border-border hover:border-red-500 text-red-600 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors hover:bg-red-50"
    >
      <LogOut className="w-4 h-4" /> Sign Out
    </button>
  )
}
