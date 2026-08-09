import React from 'react'
import { Header } from '@/components/storefront/Header'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { prisma, isDatabaseConfigured } from '@/lib/prisma'
import { Users as UsersIcon, ShieldCheck, Mail, Calendar } from 'lucide-react'

export default async function AdminUsersPage() {
  let users: Array<{
    id: string
    name: string
    email: string
    role: string
    createdAt: Date
    provider: string
  }> = []

  if (isDatabaseConfigured()) {
    try {
      const dbUsers = await prisma.user.findMany({
        orderBy: { createdAt: 'desc' },
      })
      users = dbUsers.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role,
        createdAt: u.createdAt,
        provider: u.passwordHash.includes('OAUTH_GOOGLE') ? 'Google OAuth (Gmail)' : 'Password Account',
      }))
    } catch (e) {
      console.warn('MongoDB user list query fallback:', e)
    }
  }

  // Seed default demonstration users if DB is empty
  if (users.length === 0) {
    users = [
      {
        id: 'cust-01',
        name: 'khelega frefire',
        email: 'khelegafrefire12@gmail.com',
        role: 'CUSTOMER',
        createdAt: new Date(),
        provider: 'Google OAuth (Gmail)',
      },
      {
        id: 'admin-01',
        name: 'Master Admin',
        email: 'admin@mystore.com',
        role: 'SUPER_ADMIN',
        createdAt: new Date(Date.now() - 86400000 * 30),
        provider: 'Password Account',
      },
      {
        id: 'cust-02',
        name: 'Jane Customer',
        email: 'customer@mystore.com',
        role: 'CUSTOMER',
        createdAt: new Date(Date.now() - 86400000 * 14),
        provider: 'Password Account',
      },
    ]
  }

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-8 overflow-y-auto">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-6">
          <div>
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
              User & Customer Management
            </span>
            <h1 className="text-3xl font-serif font-bold text-foreground">Registered Users & Google Accounts</h1>
            <p className="text-xs text-muted-foreground mt-1">
              Showing active customer accounts, administrative staff, and Google OAuth profiles.
            </p>
          </div>
          <div className="px-4 py-2 bg-accent-sage/20 border border-accent-sage/40 rounded-full text-xs font-bold text-foreground flex items-center gap-2">
            <UsersIcon className="w-4 h-4 text-accent-terracotta" /> Total Users: {users.length}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted border-b border-border font-semibold text-muted-foreground uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Account Type / Auth Method</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-semibold text-foreground flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-accent-terracotta/15 text-accent-terracotta font-bold flex items-center justify-center text-xs">
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground text-sm">{u.name}</p>
                        <p className="text-[10px] text-muted-foreground font-mono">ID: {u.id}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">
                      <span className="flex items-center gap-1.5 text-foreground">
                        <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                        {u.email}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold ${
                        u.provider.includes('Google')
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-stone-100 text-stone-700 border border-stone-200'
                      }`}>
                        {u.provider}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        u.role === 'SUPER_ADMIN' || u.role === 'ADMIN'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground font-mono">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
