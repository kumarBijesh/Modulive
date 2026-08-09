'use server'

import { productSchema, updateOrderStatusSchema, categorySchema } from '@/lib/validations'
import { getMockSession } from '@/lib/auth'
import { mockProducts, mockCategories, prisma } from '@/lib/prisma'
import { getMockAuditLogs, logAuditEvent } from '@/lib/security/audit-logger'
import { AppError, ForbiddenError, handleActionError } from '@/lib/errors'

async function verifyAdminPermission() {
  const session = await getMockSession()
  if (!session || (session.role !== 'ADMIN' && session.role !== 'SUPER_ADMIN')) {
    throw new ForbiddenError('Administrative privileges required')
  }
  return session
}

export async function adminCreateProductAction(formData: unknown) {
  try {
    const admin = await verifyAdminPermission()
    const validated = productSchema.parse(formData)

    const slug = validated.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')

    const newProduct = {
      id: `prod-${Date.now()}`,
      ...validated,
      slug,
      category: mockCategories.find((c) => c.id === validated.categoryId) || mockCategories[0],
      compareAtCents: validated.compareAtCents || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    mockProducts.unshift(newProduct as unknown as typeof mockProducts[0])

    await logAuditEvent({
      userId: admin.id,
      userEmail: admin.email,
      action: 'PRODUCT_CREATED',
      resource: 'AdminProducts',
      details: { title: validated.title, priceCents: validated.priceCents, stock: validated.stock },
    })

    return { success: true, product: newProduct, message: 'Product created successfully' }
  } catch (err) {
    return handleActionError(err)
  }
}

export async function adminUpdateProductAction(id: string, formData: unknown) {
  try {
    const admin = await verifyAdminPermission()
    const validated = productSchema.parse(formData)

    const index = mockProducts.findIndex((p) => p.id === id)
    if (index === -1) {
      throw new AppError('Product not found', 404)
    }

    mockProducts[index] = {
      ...mockProducts[index],
      ...validated,
      compareAtCents: validated.compareAtCents || null,
      updatedAt: new Date(),
    } as unknown as typeof mockProducts[0]

    await logAuditEvent({
      userId: admin.id,
      userEmail: admin.email,
      action: 'PRODUCT_UPDATED',
      resource: 'AdminProducts',
      details: { productId: id, title: validated.title },
    })

    return { success: true, product: mockProducts[index], message: 'Product updated successfully' }
  } catch (err) {
    return handleActionError(err)
  }
}

export async function adminDeleteProductAction(id: string) {
  try {
    const admin = await verifyAdminPermission()
    const index = mockProducts.findIndex((p) => p.id === id)

    if (index === -1) {
      throw new AppError('Product not found', 404)
    }

    const removed = mockProducts.splice(index, 1)[0]

    await logAuditEvent({
      userId: admin.id,
      userEmail: admin.email,
      action: 'PRODUCT_DELETED',
      resource: 'AdminProducts',
      details: { productId: id, title: removed.title },
    })

    return { success: true, message: 'Product removed from store' }
  } catch (err) {
    return handleActionError(err)
  }
}

export async function adminGetDashboardMetricsAction() {
  try {
    await verifyAdminPermission()

    const totalProducts = mockProducts.length
    const activeProducts = mockProducts.filter((p) => p.status === 'ACTIVE').length
    const lowStockProducts = mockProducts.filter((p) => p.stock < 10)
    const mockRevenueCents = 1845000 // $18,450.00
    const totalOrdersCount = 42

    return {
      success: true,
      metrics: {
        totalProducts,
        activeProducts,
        lowStockCount: lowStockProducts.length,
        totalRevenueCents: mockRevenueCents,
        totalOrdersCount,
        lowStockProducts,
      },
    }
  } catch (err) {
    return handleActionError(err)
  }
}

export async function adminGetAuditLogsAction() {
  try {
    await verifyAdminPermission()
    const logs = getMockAuditLogs()
    return { success: true, logs }
  } catch (err) {
    return handleActionError(err)
  }
}
