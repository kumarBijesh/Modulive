import React from 'react'
import { redirect } from 'next/navigation'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { getCurrentUserAction } from '@/actions/auth-actions'
import { adminGetAuditLogsAction } from '@/actions/admin-actions'

export default async function AdminAuditLogsPage() {
  const user = await getCurrentUserAction()

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPER_ADMIN')) {
    redirect('/login')
  }

  const logsRes = await adminGetAuditLogsAction()
  const logs = logsRes.success && 'logs' in logsRes ? logsRes.logs : []

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-background w-full">
      <AdminSidebar />

      <main className="flex-1 p-4 sm:p-8 lg:p-12 overflow-y-auto w-full">
        {/* Header */}
        <div className="mb-6 sm:mb-8 pb-4 sm:pb-6 border-b border-border">
          <span className="text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
            Zero-Trust Compliance
          </span>
          <h1 className="text-lg sm:text-3xl font-serif font-bold text-foreground tracking-tight">Security Audit Logs</h1>
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-relaxed">
            Immutable log of all user authentication events, order creations, administrative actions, and access attempts.
          </p>
        </div>

        {/* Mobile Responsive Audit Cards (< md) */}
        <div className="block md:hidden space-y-3">
          {logs.length === 0 ? (
            <div className="bg-card border border-border rounded-xl p-8 text-center text-xs text-muted-foreground">
              No security audit events recorded yet.
            </div>
          ) : (
            logs.map((log: any) => (
              <div key={log.id} className="bg-card border border-border rounded-xl p-3.5 space-y-2 shadow-xs text-xs font-mono">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-accent-terracotta text-xs break-all">{log.action}</span>
                  <span className="px-2 py-0.5 rounded-full bg-muted text-foreground text-[10px] font-semibold uppercase shrink-0">
                    {log.resource}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-700 pt-1">
                  <span className="break-all font-semibold">{log.userEmail || 'Guest / System'}</span>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(log.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {log.details && Object.keys(log.details).length > 0 && (
                  <div className="pt-2 border-t border-border/60 text-[10px] text-muted-foreground break-all">
                    {JSON.stringify(log.details)}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Desktop Responsive Table (>= md) */}
        <div className="hidden md:block bg-card border border-border rounded-3xl overflow-hidden shadow-sm">
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
