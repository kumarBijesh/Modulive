'use client'

import React, { useState } from 'react'

interface GoogleButtonProps {
  onGoogleSignIn: () => Promise<void>
  label?: string
}

export function GoogleButton({ onGoogleSignIn, label = 'Continue with Google' }: GoogleButtonProps) {
  const [loading, setLoading] = useState(false)

  const handleClick = async () => {
    setLoading(true)
    try {
      await onGoogleSignIn()
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="w-full flex items-center justify-center gap-3 py-3.5 px-4 bg-background hover:bg-muted text-foreground font-medium text-xs rounded-2xl border border-border shadow-sm hover:shadow transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-foreground/30 border-t-foreground rounded-full animate-spin" />
      ) : (
        <svg className="w-4 h-4 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.39 7.37 24 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.27A7.2 7.2 0 0 1 4.9 12c0-.79.13-1.57.38-2.27V6.58H1.24A11.95 11.95 0 0 0 0 12c0 1.92.45 3.74 1.24 5.42l4.04-3.15z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.61 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
          />
        </svg>
      )}
      <span className="font-semibold text-xs tracking-wide">{label}</span>
    </button>
  )
}
