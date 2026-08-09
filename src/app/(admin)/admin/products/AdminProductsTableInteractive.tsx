'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { adminCreateProductAction, adminDeleteProductAction } from '@/actions/admin-actions'
import { Plus, Trash2, Search, Image as ImageIcon } from 'lucide-react'

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
    priceDollars: 1250,
    stock: 10,
    categoryId: categories[0]?.id || '',
    imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
    material: 'Solid European Oak & Italian Bouclé',
    color: 'Oatmeal Ivory',
    dimensions: 'W: 92cm x D: 88cm x H: 76cm',
    status: 'ACTIVE' as const,
  })

  const formatPrice = (cents: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(cents / 100)
  }

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const payload = {
      title: formData.title,
      description: formData.description,
      priceCents: Math.round((Number(formData.priceDollars) || 0) * 100),
      stock: Number(formData.stock) || 0,
      categoryId: formData.categoryId,
      images: [formData.imageUrl.trim() || 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80'],
      material: formData.material,
      color: formData.color,
      dimensions: formData.dimensions,
      status: formData.status,
    }

    const res = await adminCreateProductAction(payload)
    setLoading(false)

    if (res.success && res.product) {
      setProducts([res.product, ...products])
      setIsModalOpen(false)
      setFormData({
        title: '',
        description: '',
        priceDollars: 1250,
        stock: 10,
        categoryId: categories[0]?.id || '',
        imageUrl: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
        material: 'Solid European Oak & Italian Bouclé',
        color: 'Oatmeal Ivory',
        dimensions: 'W: 92cm x D: 88cm x H: 76cm',
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
    <div className="space-y-4 sm:space-y-6">
      {/* Top Search & Create Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative max-w-sm w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-full text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground shadow-xs"
          />
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto py-2.5 px-6 text-xs font-semibold uppercase tracking-wider">
          <Plus className="w-4 h-4 mr-2" /> Add New Furniture Item
        </Button>
      </div>

      {/* Mobile Responsive Product Cards (< md) */}
      <div className="block md:hidden space-y-3">
        {filteredProducts.map((p) => (
          <div key={p.id} className="bg-card border border-border rounded-xl p-3.5 space-y-3 shadow-xs">
            <div className="flex items-start gap-3">
              <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                <Image src={p.images[0] || ''} alt={p.title} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent-terracotta block truncate">
                  {p.category?.name || 'Furniture'}
                </span>
                <h4 className="font-serif font-semibold text-foreground text-xs leading-snug">{p.title}</h4>
                <p className="text-xs font-semibold text-foreground mt-0.5">{formatPrice(p.priceCents)}</p>
              </div>
              <button
                onClick={() => handleDelete(p.id)}
                className="p-2 text-muted-foreground hover:text-red-600 rounded-full hover:bg-red-50 transition-colors shrink-0"
                title="Delete Product"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-border/60 text-xs">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] ${p.stock < 10 ? 'bg-amber-100 text-amber-800' : 'bg-muted text-foreground'}`}>
                  {p.stock} units
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold uppercase text-[10px]">
                  {p.status}
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground font-mono truncate max-w-[120px]">{p.slug}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop Data Table (>= md) */}
      <div className="hidden md:block bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
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
                  <td className="px-6 py-4 font-medium text-foreground">{p.category?.name || 'Furniture'}</td>
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

      {/* Modal Dialog for Adding Product (Senior UI/UX Design) */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Product">
        <form onSubmit={handleCreate} className="space-y-4">
          
          {/* Product Title */}
          <Input
            label="Product Title"
            placeholder="e.g. Kobenhavn Bouclé Lounge Chair"
            required
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          />

          {/* Product Image URL & Live Preview Box */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Product Image URL
            </label>
            <div className="flex items-center gap-3">
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-muted border border-border shrink-0 flex items-center justify-center">
                {formData.imageUrl ? (
                  <Image src={formData.imageUrl} alt="Preview" fill className="object-cover" />
                ) : (
                  <ImageIcon className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/photo-..."
                  required
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
                />
              </div>
            </div>
            <p className="text-[10px] text-muted-foreground">Paste image URL or Unsplash photo link for high-res catalog rendering.</p>
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Category
            </label>
            <select
              value={formData.categoryId}
              onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-xs font-medium text-foreground focus:outline-none focus:border-foreground cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price ($ USD) and Stock */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Price ($ USD)"
              type="number"
              placeholder="1250"
              required
              value={formData.priceDollars}
              onChange={(e) => setFormData({ ...formData, priceDollars: parseFloat(e.target.value) || 0 })}
            />
            <Input
              label="Stock Inventory"
              type="number"
              placeholder="10"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            />
          </div>

          {/* Dimensions & Material */}
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Dimensions"
              placeholder="W: 92cm x D: 88cm x H: 76cm"
              value={formData.dimensions}
              onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
            />
            <Input
              label="Material & Craft"
              placeholder="Solid Oak & Italian Bouclé"
              value={formData.material}
              onChange={(e) => setFormData({ ...formData, material: e.target.value })}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Description
            </label>
            <textarea
              required
              rows={3}
              placeholder="Describe the architectural design, timber finish, and upholstery details..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
            />
          </div>

          <Button type="submit" isLoading={loading} className="w-full py-3.5 text-xs font-semibold tracking-wider uppercase">
            Create Furniture Item
          </Button>
        </form>
      </Modal>
    </div>
  )
}
