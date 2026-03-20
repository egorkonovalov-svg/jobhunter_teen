'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-[#4F46E5]">Работа</span>
            <span className="text-xl font-bold text-gray-900">Тинейджеров</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/jobs" className="text-gray-600 hover:text-[#4F46E5] font-medium transition-colors">
              Вакансии
            </Link>
            <Link href="/jobs?type=internship" className="text-gray-600 hover:text-[#4F46E5] font-medium transition-colors">
              Стажировки
            </Link>
            <Link href="/post-job" className="text-gray-600 hover:text-[#4F46E5] font-medium transition-colors">
              Разместить вакансию
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-gray-600 hover:text-[#4F46E5] font-medium transition-colors"
            >
              Личный кабинет
            </Link>
            <Link
              href="/auth/login"
              className="text-sm px-4 py-2 border border-[#4F46E5] text-[#4F46E5] rounded-lg hover:bg-indigo-50 font-medium transition-colors"
            >
              Войти
            </Link>
            <Link
              href="/auth/register"
              className="text-sm px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] font-medium transition-colors"
            >
              Регистрация
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Меню"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4 space-y-3">
            <Link href="/jobs" className="block text-gray-700 hover:text-[#4F46E5] font-medium py-1" onClick={() => setMenuOpen(false)}>
              Вакансии
            </Link>
            <Link href="/jobs?type=internship" className="block text-gray-700 hover:text-[#4F46E5] font-medium py-1" onClick={() => setMenuOpen(false)}>
              Стажировки
            </Link>
            <Link href="/post-job" className="block text-gray-700 hover:text-[#4F46E5] font-medium py-1" onClick={() => setMenuOpen(false)}>
              Разместить вакансию
            </Link>
            <Link href="/dashboard" className="block text-gray-700 hover:text-[#4F46E5] font-medium py-1" onClick={() => setMenuOpen(false)}>
              Личный кабинет
            </Link>
            <div className="flex gap-3 pt-2">
              <Link href="/auth/login" className="flex-1 text-center px-4 py-2 border border-[#4F46E5] text-[#4F46E5] rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>
                Войти
              </Link>
              <Link href="/auth/register" className="flex-1 text-center px-4 py-2 bg-[#4F46E5] text-white rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>
                Регистрация
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
