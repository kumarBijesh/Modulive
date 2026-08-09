'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { logoutAction } from '@/actions/auth-actions'
import { Plus, LogOut } from 'lucide-react'

export function AdminHeaderActions() {
  const router = useRouter()

  const handleLogout = async () => {
    await logoutAction()
    router.push('/login')
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 shrink-0">
      <Link
        href="/admin/products"
        className="inline-flex items-center justify-center gap-2 px-4 py-2 sm:px-5 sm:py-2.5 bg-foreground text-background hover:bg-accent-warm hover:text-white rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-sm"
      >
        <Plus className="w-3.5 h-3.5" /> Add Product
      </Link>

      <button
        onClick={handleLogout}
        className="inline-flex items-center justify-center gap-1.5 px-4 py-2 sm:px-5 sm:py-2.5 border border-red-200 bg-red-50 hover:bg-red-100 text-red-600 rounded-full text-xs font-semibold uppercase tracking-wider transition-all shadow-xs"
      >
        <LogOut className="w-3.5 h-3.5" /> Sign Out
      </button>
    </div>
  )
}
