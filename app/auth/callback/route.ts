import { createClient } from '@/lib/supabase/server'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * OAuth and magic link callback handler.
 * Supabase redirects users here after email confirmation or OAuth flow completes.
 * Exchanges the authorization code for a session via `exchangeCodeForSession`.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  // Prevent open redirect: only allow relative paths
  const redirectTo = next.startsWith('/') ? next : '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${redirectTo}`)
    }
  }

  // On error, redirect to login with error indicator
  return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_failed`)
}
