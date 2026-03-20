'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Suspense } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const raw = searchParams.get('redirectTo') ?? '/'
  const redirectTo = raw.startsWith('/') && !raw.startsWith('//') ? raw : '/'

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Неверный email или пароль. Попробуйте ещё раз.')
      setLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center px-4">
      <div className="bg-white rounded-lg border border-border p-8 w-full max-w-md shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="text-center mb-8">
          <h1 className="heading-display text-2xl font-bold text-midnight">Вход в аккаунт</h1>
          <p className="text-text-secondary mt-2">Рады видеть тебя снова</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <Input
            label="Пароль"
            type="password"
            placeholder="Ваш пароль"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-800 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? 'Входим...' : 'Войти'}
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Ещё нет аккаунта?{' '}
          <Link href="/auth/register" className="text-gold font-medium hover:text-gold-hover link-underline transition-colors duration-300">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
