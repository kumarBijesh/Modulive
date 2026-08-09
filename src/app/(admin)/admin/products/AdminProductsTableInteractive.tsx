'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { adminCreateProductAction, adminDeleteProductAction } from '@/actions/admin-actions'
import { Plus, Trash2, Edit2, Package, Search } from 'lucide-react'

export interface AdminProductsTableInteractiveProps {
  initialProducts: any[]
  categories: any[]
}

export function AdminProductsTableInteractive({ initialProducts, categories }: AdminProductsTableInteractiveProps) {
  const [products, setProducts] = useState(initialProducts)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priceCents: 95000,
    stock: 10,
    categoryId: categories[0]?.id || '',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'],
    material: 'Solid Wood & Italian Linen',
    color: 'Natural Ivory',
    dimensions: 'W: 90cm x D: 85cm x H: 75cm',
    status: 'ACTIVE' as const,
  })

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const res = await adminCreateProductAction(formData)
    setLoading(false)

    if (res.success && res.product) {
      setProducts([res.product, ...products])
      setIsModalOpen(false)
      setFormData({
        title: '',
        description: '',
        priceCents: 95000,
        stock: 10,
        categoryId: categories[0]?.id || '',
        images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'],
        material: 'Solid Wood & Italian Linen',
        color: 'Natural Ivory',
        dimensions: 'W: 90cm x D: 85cm x H: 75cm',
        status: 'ACTIVE',
      })
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this product?')) return
    const res = await adminDeleteProductAction(id)
    if (res.success) {
      setProducts(products.filter((p) => p.id !== id))
    }
  }

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-xs w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-full text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
          />
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="py-2.5 px-6 text-xs font-semibold uppercase">
          <Plus className="w-4 h-4 mr-2" /> Add New Furniture Item
        </Button>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                      <Image src={p.images[0] || ''} alt={p.title} fill className="object-cover" />
                    </div>
                    <div>
                      <p className="font-serif font-semibold text-foreground text-sm line-clamp-1">{p.title}</p>
                      <p className="text-[10px] text-muted-foreground font-mono">{p.slug}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-foreground">{p.category.name}</td>
                  <td className="px-6 py-4 font-semibold text-foreground">{formatPrice(p.priceCents)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full font-bold ${p.stock < 10 ? 'bg-amber-100 text-amber-800' : 'bg-muted text-foreground'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-2 text-muted-foreground hover:text-red-600 rounded-full hover:bg-muted transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Dialog for Adding Product */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Product">
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Product Title"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-border rounded-lg text-xs font-medium focus:outline-none focus:border-foreground"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (in Cents, e.g. 125000 = $1,250)"
              type="number"
              required
              value={formData.priceCents}
              onChange={(e) => setFormData({ ...formData, priceCents: parseInt(e.target.value) || 0 })}
            />
            <Input
              label="Stock Inventory"
              type="number"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Description
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 bg-white border border-border rounded-lg text-xs focus:outline-none focus:border-foreground"
            />
          </div>

          <Button type="submit" isLoading={loading} className="w-full py-3 text-xs font-semibold tracking-wider uppercase">
            Create Furniture Item
          </Button>
        </form>
      </Modal>
    </div>
  )
}
