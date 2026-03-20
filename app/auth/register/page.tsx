'use client'

import { useState, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { CITIES } from '@/lib/constants'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'teen' | 'employer'>('teen')
  const [city, setCity] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const supabase = createClient()

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role,
          city,
          company_name: companyName,
        },
      },
    })

    if (signUpError) {
      setError(signUpError.message === 'User already registered'
        ? 'Пользователь с таким email уже существует.'
        : 'Ошибка регистрации. Попробуйте позже.')
      setLoading(false)
      return
    }

    // Upsert profile if not created by trigger
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        role,
        name,
        city: city || null,
        company_name: role === 'employer' ? companyName : null,
      })
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Создать аккаунт</h1>
          <p className="text-gray-500 mt-1">Присоединяйся к РаботаТинейджеров</p>
        </div>

        {/* Role Toggle */}
        <div className="flex rounded-lg border border-gray-200 overflow-hidden mb-6">
          <button
            type="button"
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              role === 'teen'
                ? 'bg-[#4F46E5] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setRole('teen')}
          >
            🔍 Ищу работу
          </button>
          <button
            type="button"
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              role === 'employer'
                ? 'bg-[#4F46E5] text-white'
                : 'bg-white text-gray-600 hover:bg-gray-50'
            }`}
            onClick={() => setRole('employer')}
          >
            🏢 Я работодатель
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Имя"
            type="text"
            placeholder={role === 'employer' ? 'Контактное лицо' : 'Твоё имя'}
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
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
            placeholder="Минимум 6 символов"
            value={password}
            onChange={e => setPassword(e.target.value)}
            minLength={6}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Город</label>
            <select
              value={city}
              onChange={e => setCity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
            >
              <option value="">Выберите город</option>
              {CITIES.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {role === 'employer' && (
            <Input
              label="Название компании"
              type="text"
              placeholder="ООО «Ваша компания»"
              value={companyName}
              onChange={e => setCompanyName(e.target.value)}
              required={role === 'employer'}
            />
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" size="lg" className="w-full mt-2" disabled={loading}>
            {loading ? 'Регистрируем...' : 'Создать аккаунт'}
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Уже есть аккаунт?{' '}
          <Link href="/auth/login" className="text-[#4F46E5] font-medium hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  )
}
