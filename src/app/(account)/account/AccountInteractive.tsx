'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logoutAction } from '@/actions/auth-actions'
import { ShieldAlert, LogOut } from 'lucide-react'

export function AccountInteractive({ role }: { role?: string }) {
  const router = useRouter()
  const isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN'

  const handleLogout = async () => {
    await logoutAction()
    router.push('/login')
  }

  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 shrink-0">
      {isAdmin && (
        <Link
          href="/admin"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 bg-accent-terracotta text-white rounded-full text-xs font-semibold uppercase tracking-wider hover:bg-accent-warm transition-colors shadow-xs"
        >
          <ShieldAlert className="w-3.5 h-3.5" /> Admin Panel
        </Link>
      )}

      <button
        onClick={handleLogout}
        className="inline-flex items-center gap-1.5 px-3.5 py-2 sm:px-4 sm:py-2 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-xs font-semibold uppercase tracking-wider transition-colors shadow-xs"
      >
        <LogOut className="w-3.5 h-3.5" /> Sign Out
      </button>
    </div>
  )
}
