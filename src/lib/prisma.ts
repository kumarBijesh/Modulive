import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL
  if (!url) return false
  if (url.includes('<db_password>') || url.includes('<password>') || url.includes('username:password')) return false
  return true
}

export const mockCategories = [
  {
    id: 'cat-seating-01',
    name: 'Seating & Sofas',
    slug: 'seating',
    description: 'Sculptural armchairs, modular sofas, and refined lounge seating crafted for comfort and posture.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'cat-tables-02',
    name: 'Tables & Desks',
    slug: 'tables',
    description: 'Solid oak dining tables, minimalist coffee tables, and contemporary executive desks.',
    image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1000&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'cat-lighting-03',
    name: 'Architectural Lighting',
    slug: 'lighting',
    description: 'Ambient floor lamps, sculptural pendants, and dimmable brass desk fixtures.',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'cat-storage-04',
    name: 'Storage & Credenzas',
    slug: 'storage',
    description: 'Minimalist sideboards, walnut credenzas, and modular wall shelving systems.',
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export const mockProducts = [
  {
    id: 'prod-01',
    title: 'Modulive Bouclé Curved Lounge Armchair',
    slug: 'modulive-boucle-curved-lounge-armchair',
    description: 'Inspired by organic architectural silhouettes, the Modulive Bouclé Armchair features a continuous curved backrest wrapped in tactile Italian wool-blend bouclé. Supported by an internal kiln-dried hardwood frame.',
    priceCents: 125000,
    compareAtCents: 145000,
    stock: 14,
    categoryId: 'cat-seating-01',
    category: mockCategories[0],
    images: [
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
    ],
    dimensions: 'W: 92cm x D: 88cm x H: 76cm (Seat Height: 42cm)',
    material: 'Italian Bouclé, Solid Beech Interior Frame, High-Density Foam',
    color: 'Oatmeal Ivory',
    isFeatured: true,
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-02',
    title: 'Kobenhavn Solid White Oak Dining Table',
    slug: 'kobenhavn-solid-white-oak-dining-table',
    description: 'A monument to Scandinavian woodworking, the Kobenhavn table is carved from sustainably harvested European white oak with soft bevelled edges and pillar legs.',
    priceCents: 240000,
    compareAtCents: 275000,
    stock: 8,
    categoryId: 'cat-tables-02',
    category: mockCategories[1],
    images: [
      'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
    ],
    dimensions: 'L: 220cm x W: 95cm x H: 75cm',
    material: 'FSC-Certified Solid European White Oak, Natural Matte Oil Finish',
    color: 'Natural Soft Oak',
    isFeatured: true,
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-03',
    title: 'Aura Opal Glass & Brushed Brass Floor Lamp',
    slug: 'aura-opal-glass-brushed-brass-floor-lamp',
    description: 'Dimmable ambient floor lamp featuring a mouth-blown opal glass globe resting upon a slender brushed solid brass stem and heavy travertine stone base.',
    priceCents: 68000,
    compareAtCents: null,
    stock: 22,
    categoryId: 'cat-lighting-03',
    category: mockCategories[2],
    images: [
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
    ],
    dimensions: 'H: 165cm, Globe Diameter: 30cm, Base Diameter: 28cm',
    material: 'Mouth-Blown Opal Glass, Solid Brass, Italian Travertine Base',
    color: 'Warm Brass & Travertine',
    isFeatured: true,
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-04',
    title: 'Vesterbro Modular 3-Piece Walnut Credenza',
    slug: 'vesterbro-modular-3-piece-walnut-credenza',
    description: 'Minimalist low sideboard with push-to-open slatted doors and integrated cord management. Handcrafted in walnut veneer over solid birch core.',
    priceCents: 189000,
    compareAtCents: 210000,
    stock: 6,
    categoryId: 'cat-storage-04',
    category: mockCategories[3],
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
    ],
    dimensions: 'W: 180cm x D: 45cm x H: 65cm',
    material: 'American Walnut Veneer, Solid Birch Core, Powder-Coated Steel Legs',
    color: 'Dark Walnut',
    isFeatured: true,
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-05',
    title: 'Solstice Minimalist Travertine Coffee Table',
    slug: 'solstice-minimalist-travertine-coffee-table',
    description: 'Honored in unpolished beige travertine stone, presenting a low monolithic silhouette with soft rounded bullnose edges.',
    priceCents: 115000,
    compareAtCents: null,
    stock: 10,
    categoryId: 'cat-tables-02',
    category: mockCategories[1],
    images: [
      'https://images.unsplash.com/photo-1533779283484-8ad4940aa3a8?auto=format&fit=crop&w=1200&q=80',
    ],
    dimensions: 'L: 120cm x W: 70cm x H: 34cm',
    material: 'Natural Italian Beige Travertine Stone',
    color: 'Honed Travertine',
    isFeatured: false,
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'prod-06',
    title: 'Norden Ergonomic Walnut Desk Chair',
    slug: 'norden-ergonomic-walnut-desk-chair',
    description: 'Combining mid-century elegance with ergonomic lower lumbar support, fully upholstered in top-grain aniline leather.',
    priceCents: 85000,
    compareAtCents: 98000,
    stock: 18,
    categoryId: 'cat-seating-01',
    category: mockCategories[0],
    images: [
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80',
    ],
    dimensions: 'W: 64cm x D: 62cm x H: 85-95cm',
    material: 'Walnut Plywood Shell, Aniline Italian Leather, Cast Aluminum Base',
    color: 'Cognac Leather & Walnut',
    isFeatured: false,
    status: 'ACTIVE',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]
