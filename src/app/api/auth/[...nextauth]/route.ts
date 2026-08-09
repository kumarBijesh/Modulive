import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ status: 'Auth.js endpoint active' })
}

export async function POST() {
  return NextResponse.json({ status: 'Auth.js POST endpoint active' })
}
