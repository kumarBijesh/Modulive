import { NextResponse } from 'next/server'

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const redirectUri = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/auth/callback/google`

  if (!clientId) {
    return NextResponse.json(
      { error: 'GOOGLE_CLIENT_ID is missing in .env file' },
      { status: 500 }
    )
  }

  const scope = encodeURIComponent('openid email profile')
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=${scope}&prompt=select_account`

  return NextResponse.redirect(googleAuthUrl)
}
