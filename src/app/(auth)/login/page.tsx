'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/storefront/Header'
import { Footer } from '@/components/storefront/Footer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { loginAction, googleLoginAction } from '@/actions/auth-actions'
import { GoogleButton } from '@/components/auth/GoogleButton'
import { Lock, ShieldAlert } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleSignIn = async () => {
    setError('')
    // Trigger real Google OAuth authorization redirect
    window.location.href = '/api/auth/google'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await loginAction({ email, password })
    setLoading(false)

    if (res.success && res.user) {
      if (res.user.role === 'ADMIN' || res.user.role === 'SUPER_ADMIN') {
        router.push('/admin')
      } else {
        router.push('/account')
      }
    } else {
      setError('error' in res ? (res as { error: string }).error : 'Invalid credentials')
    }
  }

  const fillDemoAdmin = () => {
    setEmail('admin@mystore.com')
    setPassword('AdminPassword123!')
  }

  const fillDemoCustomer = () => {
    setEmail('customer@mystore.com')
    setPassword('CustomerPassword123!')
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-md mx-auto px-4 py-8 sm:py-16 w-full flex items-center">
        <div className="bg-card border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-card w-full">
          <div className="text-center space-y-1.5 sm:space-y-2">
            <span className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
              Welcome Back
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-foreground">Sign in to your account</h1>
          </div>

          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium leading-relaxed">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email Address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" isLoading={loading} className="w-full py-3.5 text-xs font-semibold tracking-wider uppercase">
              Sign In
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-semibold tracking-widest">
              <span className="bg-card px-3 text-muted-foreground">Or Continue With</span>
            </div>
          </div>

          <GoogleButton onGoogleSignIn={handleGoogleSignIn} label="Continue with Google" />

          {/* Developer Quick-Fill Preset Buttons */}
          <div className="pt-4 border-t border-border space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-center">
              Quick Demo Logins
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="px-3 py-2 bg-accent-terracotta/10 text-accent-terracotta hover:bg-accent-terracotta hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center justify-center gap-1"
              >
                <ShieldAlert className="w-3.5 h-3.5" /> Admin Demo
              </button>
              <button
                type="button"
                onClick={fillDemoCustomer}
                className="px-3 py-2 bg-muted text-foreground hover:bg-border rounded-xl text-xs font-semibold transition-all"
              >
                Customer Demo
              </button>
            </div>
          </div>

          <p className="text-center text-xs text-muted-foreground pt-2">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-accent-terracotta font-semibold hover:underline">
              Create an Account
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
