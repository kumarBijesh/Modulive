'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Header } from '@/components/storefront/Header'
import { Footer } from '@/components/storefront/Footer'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { registerAction, googleLoginAction } from '@/actions/auth-actions'
import { GoogleButton } from '@/components/auth/GoogleButton'

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleGoogleSignUp = async () => {
    setError('')
    // Trigger real Google OAuth authorization redirect
    window.location.href = '/api/auth/google'
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await registerAction({ name, email, password })
    setLoading(false)

    if (res.success) {
      router.push('/account')
    } else {
      setError(res.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 max-w-md mx-auto px-4 py-16 w-full flex items-center">
        <div className="bg-card border border-border rounded-3xl p-8 space-y-6 shadow-card w-full">
          <div className="text-center space-y-2">
            <span className="text-xs font-semibold uppercase tracking-widest text-accent-terracotta">
              New Customer
            </span>
            <h1 className="text-3xl font-serif font-bold text-foreground">Create your account</h1>
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

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
              helperText="Must be at least 8 characters with 1 uppercase letter and 1 number."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Button type="submit" isLoading={loading} className="w-full py-4 text-xs font-semibold tracking-wider uppercase">
              Create Account
            </Button>
          </form>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-semibold tracking-widest">
              <span className="bg-card px-3 text-muted-foreground">Or Register With</span>
            </div>
          </div>

          <GoogleButton onGoogleSignIn={handleGoogleSignUp} label="Sign up with Google" />

          <p className="text-center text-xs text-muted-foreground pt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-accent-terracotta font-semibold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
