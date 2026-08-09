import React from 'react'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { getCurrentUserAction } from '@/actions/auth-actions'
import { getProductsAction, getCategoriesAction } from '@/actions/product-actions'
import { AdminProductsTableInteractive } from './AdminProductsTableInteractive'

export default async function AdminProductsPage() {
  const user = await getCurrentUserAction()

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/login')
  }

  const productsRes = await getProductsAction()
  const categoriesRes = await getCategoriesAction()

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background w-full">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto w-full">
        <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
            Inventory & Catalog
          </span>
          <h1 className="text-lg sm:text-3xl font-serif font-bold text-foreground tracking-tight">Product Management</h1>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Create, update, or remove furniture pieces from the active storefront catalog.
          </p>
        </div>

        <AdminProductsTableInteractive
          initialProducts={productsRes.success && 'products' in productsRes ? (productsRes.products as any) : []}
          categories={categoriesRes.success && 'categories' in categoriesRes ? (categoriesRes.categories as any) : []}
        />
      </main>
    </div>
  )
}
