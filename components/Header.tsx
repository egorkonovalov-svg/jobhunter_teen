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
    <header className="bg-white/80 backdrop-blur-xl border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1">
            <span className="heading-display text-xl font-bold text-gold">Работа</span>
            <span className="heading-display text-xl font-bold text-midnight tracking-tight">Тинейджеров</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/jobs" className="text-sm font-medium text-text-secondary hover:text-midnight link-underline transition-colors duration-300">
              Вакансии
            </Link>
            <Link href="/jobs?type=internship" className="text-sm font-medium text-text-secondary hover:text-midnight link-underline transition-colors duration-300">
              Стажировки
            </Link>
            <Link href="/post-job" className="text-sm font-medium text-text-secondary hover:text-midnight link-underline transition-colors duration-300">
              Разместить вакансию
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-sm text-text-secondary hover:text-midnight font-medium link-underline transition-colors duration-300"
            >
              Личный кабинет
            </Link>
            <Link
              href="/auth/login"
              className="text-sm px-4 py-2 border border-midnight text-midnight rounded-lg hover:bg-midnight hover:text-white font-medium transition-all duration-300"
            >
              Войти
            </Link>
            <Link
              href="/auth/register"
              className="text-sm px-4 py-2 bg-midnight text-white rounded-lg hover:bg-navy font-medium transition-all duration-300"
            >
              Регистрация
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md text-text-secondary hover:text-midnight"
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
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <Link href="/jobs" className="block text-midnight hover:text-gold font-medium py-1" onClick={() => setMenuOpen(false)}>
              Вакансии
            </Link>
            <Link href="/jobs?type=internship" className="block text-midnight hover:text-gold font-medium py-1" onClick={() => setMenuOpen(false)}>
              Стажировки
            </Link>
            <Link href="/post-job" className="block text-midnight hover:text-gold font-medium py-1" onClick={() => setMenuOpen(false)}>
              Разместить вакансию
            </Link>
            <Link href="/dashboard" className="block text-midnight hover:text-gold font-medium py-1" onClick={() => setMenuOpen(false)}>
              Личный кабинет
            </Link>
            <div className="flex gap-3 pt-2">
              <Link href="/auth/login" className="flex-1 text-center px-4 py-2 border border-midnight text-midnight rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>
                Войти
              </Link>
              <Link href="/auth/register" className="flex-1 text-center px-4 py-2 bg-midnight text-white rounded-lg text-sm font-medium" onClick={() => setMenuOpen(false)}>
                Регистрация
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
