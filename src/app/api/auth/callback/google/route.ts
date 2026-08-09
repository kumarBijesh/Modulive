import { NextRequest, NextResponse } from 'next/server'
import { prisma, isDatabaseConfigured } from '@/lib/prisma'
import { setMockSession } from '@/lib/auth'
import { logAuditEvent } from '@/lib/security/audit-logger'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const error = searchParams.get('error')

  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'

  if (error || !code) {
    console.error('Google OAuth callback error:', error)
    return NextResponse.redirect(`${baseUrl}/login?error=Google authentication cancelled`)
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET
    const redirectUri = `${baseUrl}/api/auth/callback/google`

    if (!clientId || !clientSecret) {
      throw new Error('Google OAuth credentials not configured in .env')
    }

    // 1. Exchange authorization code for Google access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    const tokenData = await tokenResponse.json()

    if (!tokenResponse.ok || !tokenData.access_token) {
      console.error('Failed to retrieve token from Google:', tokenData)
      return NextResponse.redirect(`${baseUrl}/login?error=Google authentication failed`)
    }

    // 2. Fetch authenticated user profile from Google UserInfo API
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    })

    const googleUser = await userResponse.json()

    if (!googleUser || !googleUser.email) {
      return NextResponse.redirect(`${baseUrl}/login?error=Unable to fetch Google profile details`)
    }

    const email = googleUser.email.toLowerCase().trim()
    const name = googleUser.name || googleUser.given_name || email.split('@')[0]

    let userSession = null

    // 3. Upsert user in MongoDB Atlas database if configured
    if (isDatabaseConfigured()) {
      try {
        let dbUser = await prisma.user.findUnique({ where: { email } })

        if (!dbUser) {
          dbUser = await prisma.user.create({
            data: {
              name,
              email,
              passwordHash: 'OAUTH_GOOGLE_ACCOUNT',
              role: 'CUSTOMER',
              emailVerified: new Date(),
            },
          })
        }

        userSession = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role as 'CUSTOMER' | 'ADMIN' | 'SUPER_ADMIN',
        }
      } catch (dbErr) {
        console.warn('Database upsert fallback during Google OAuth:', dbErr)
        userSession = {
          id: `google-${Date.now()}`,
          name,
          email,
          role: 'CUSTOMER' as const,
        }
      }
    } else {
      userSession = {
        id: `google-${Date.now()}`,
        name,
        email,
        role: 'CUSTOMER' as const,
      }
    }

    // 4. Save session and log audit event
    await setMockSession(userSession)
    await logAuditEvent({
      userId: userSession.id,
      userEmail: userSession.email,
      action: 'GOOGLE_OAUTH_SUCCESS',
      resource: 'Auth',
      details: { provider: 'google', email: googleUser.email },
    })

    // 5. Redirect user to account page with HTTP session cookie attached
    const destination = userSession.role === 'ADMIN' || userSession.role === 'SUPER_ADMIN' ? '/admin' : '/account'
    const response = NextResponse.redirect(`${baseUrl}${destination}`)
    response.cookies.set('mystore_session', JSON.stringify(userSession), {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    })
    return response
  } catch (err) {
    console.error('Google OAuth Callback Exception:', err)
    return NextResponse.redirect(`${baseUrl}/login?error=Google login internal error`)
  }
}
