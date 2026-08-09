import React from 'react'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { getCurrentUserAction } from '@/actions/auth-actions'
import { adminGetAuditLogsAction } from '@/actions/admin-actions'
import { ShieldAlert, Terminal, Lock } from 'lucide-react'

export default async function AdminAuditLogsPage() {
  const user = await getCurrentUserAction()

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/login')
  }

  const logsRes = await adminGetAuditLogsAction()
  const logs = logsRes.success && 'logs' in logsRes ? logsRes.logs : []

  return (
    <div className="min-h-screen flex bg-background">
      <AdminSidebar />

      <main className="flex-1 p-8 sm:p-12 overflow-y-auto w-full">
        <div className="mb-8 pb-6 border-b border-border">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
            Zero-Trust Compliance
          </span>
          <h1 className="text-3xl font-serif font-bold text-foreground">Security Audit Logs</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Immutable log of all user authentication events, order creations, administrative actions, and access attempts.
          </p>
        </div>

        <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted text-muted-foreground font-semibold uppercase tracking-wider border-b border-border">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Resource</th>
                  <th className="px-6 py-4">User / Email</th>
                  <th className="px-6 py-4">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                      No security audit events recorded yet.
                    </td>
                  </tr>
                ) : (
                  logs.map((log: any) => (
                    <tr key={log.id} className="hover:bg-muted/30 transition-colors font-mono">
                      <td className="px-6 py-4 text-muted-foreground">
                        {new Date(log.createdAt).toLocaleTimeString()} • {new Date(log.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-bold text-accent-terracotta">{log.action}</td>
                      <td className="px-6 py-4 font-medium text-foreground">{log.resource}</td>
                      <td className="px-6 py-4 text-foreground">{log.userEmail || 'Guest / System'}</td>
                      <td className="px-6 py-4 text-muted-foreground max-w-xs truncate">
                        {JSON.stringify(log.details || {})}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}
