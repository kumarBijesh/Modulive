import { PrismaClient, Role } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting MyStore database seed...')

  // Seed Categories
  const categories = [
    {
      name: 'Seating & Sofas',
      slug: 'seating',
      description: 'Sculptural armchairs, modular sofas, and refined lounge seating crafted for comfort and posture.',
      image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Tables & Desks',
      slug: 'tables',
      description: 'Solid oak dining tables, minimalist coffee tables, and contemporary executive desks.',
      image: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Architectural Lighting',
      slug: 'lighting',
      description: 'Ambient floor lamps, sculptural pendants, and dimmable brass desk fixtures.',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1000&q=80',
    },
    {
      name: 'Storage & Credenzas',
      slug: 'storage',
      description: 'Minimalist sideboards, walnut credenzas, and modular wall shelving systems.',
      image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80',
    },
  ]

  const categoryMap: Record<string, string> = {}

  for (const cat of categories) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: cat,
      create: cat,
    })
    categoryMap[cat.slug] = created.id
  }

  // Seed Products
  const products = [
    {
      title: 'Modulive Bouclé Curved Lounge Armchair',
      slug: 'modulive-boucle-curved-lounge-armchair',
      description: 'Inspired by organic architectural silhouettes, the Modulive Bouclé Armchair features a continuous curved backrest wrapped in tactile Italian wool-blend bouclé.',
      priceCents: 125000,
      compareAtCents: 145000,
      stock: 14,
      categoryId: categoryMap['seating'],
      images: [
        'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=1200&q=80',
      ],
      dimensions: 'W: 92cm x D: 88cm x H: 76cm',
      material: 'Italian Bouclé, Solid Beech Interior Frame',
      color: 'Oatmeal Ivory',
      isFeatured: true,
      status: 'ACTIVE',
    },
    {
      title: 'Kobenhavn Solid White Oak Dining Table',
      slug: 'kobenhavn-solid-white-oak-dining-table',
      description: 'Carved from sustainably harvested European white oak with soft bevelled edges and pillar legs.',
      priceCents: 240000,
      compareAtCents: 275000,
      stock: 8,
      categoryId: categoryMap['tables'],
      images: [
        'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=1200&q=80',
      ],
      dimensions: 'L: 220cm x W: 95cm x H: 75cm',
      material: 'FSC-Certified Solid European White Oak',
      color: 'Natural Soft Oak',
      isFeatured: true,
      status: 'ACTIVE',
    },
    {
      title: 'Aura Opal Glass & Brushed Brass Floor Lamp',
      slug: 'aura-opal-glass-brushed-brass-floor-lamp',
      description: 'Dimmable ambient floor lamp featuring a mouth-blown opal glass globe resting upon a slender brushed solid brass stem.',
      priceCents: 68000,
      compareAtCents: null,
      stock: 22,
      categoryId: categoryMap['lighting'],
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=1200&q=80',
      ],
      dimensions: 'H: 165cm, Globe Diameter: 30cm',
      material: 'Mouth-Blown Opal Glass, Solid Brass, Travertine Base',
      color: 'Warm Brass & Travertine',
      isFeatured: true,
      status: 'ACTIVE',
    },
    {
      title: 'Vesterbro Modular 3-Piece Walnut Credenza',
      slug: 'vesterbro-modular-3-piece-walnut-credenza',
      description: 'Minimalist low sideboard with push-to-open slatted doors and integrated cord management.',
      priceCents: 189000,
      compareAtCents: 210000,
      stock: 6,
      categoryId: categoryMap['storage'],
      images: [
        'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=80',
      ],
      dimensions: 'W: 180cm x D: 45cm x H: 65cm',
      material: 'American Walnut Veneer, Solid Birch Core',
      color: 'Dark Walnut',
      isFeatured: true,
      status: 'ACTIVE',
    },
  ]

  for (const prod of products) {
    await prisma.product.upsert({
      where: { slug: prod.slug },
      update: prod,
      create: prod,
    })
  }

  // Seed Admin & Customer User (Argon2id default hashes)
  // Demo password: AdminPassword123! and CustomerPassword123!
  const dummyArgon2Hash = '$argon2id$v=19$m=65536,t=3,p=4$dGVzdHNhbHQxMjM0NTY3OA$9Z/2m3j4L+8Q1kR5N+W8YQ'

  await prisma.user.upsert({
    where: { email: 'admin@mystore.com' },
    update: {},
    create: {
      name: 'Master Admin',
      email: 'admin@mystore.com',
      passwordHash: dummyArgon2Hash,
      role: Role.SUPER_ADMIN,
    },
  })

  await prisma.user.upsert({
    where: { email: 'customer@mystore.com' },
    update: {},
    create: {
      name: 'Jane Customer',
      email: 'customer@mystore.com',
      passwordHash: dummyArgon2Hash,
      role: Role.CUSTOMER,
    },
  })

  console.log('✅ MyStore database seed complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
