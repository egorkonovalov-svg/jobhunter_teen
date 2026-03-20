import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-midnight text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-1 mb-4">
              <span className="heading-display text-lg font-bold text-gold">Работа</span>
              <span className="heading-display text-lg font-bold text-white tracking-tight">Тинейджеров</span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Работа для подростков 14–18 лет по всей России
            </p>
          </div>

          {/* Jobs */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Вакансии</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/jobs" className="text-white/60 hover:text-white transition-colors duration-300">Все вакансии</Link></li>
              <li><Link href="/jobs?type=internship" className="text-white/60 hover:text-white transition-colors duration-300">Стажировки</Link></li>
              <li><Link href="/jobs?type=part-time" className="text-white/60 hover:text-white transition-colors duration-300">Подработка</Link></li>
              <li><Link href="/jobs?type=gig" className="text-white/60 hover:text-white transition-colors duration-300">Разовая работа</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Работодателям</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/post-job" className="text-white/60 hover:text-white transition-colors duration-300">Разместить вакансию</Link></li>
              <li><Link href="/dashboard" className="text-white/60 hover:text-white transition-colors duration-300">Личный кабинет</Link></li>
              <li><Link href="/auth/register" className="text-white/60 hover:text-white transition-colors duration-300">Регистрация</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-4">Информация</h3>
            <ul className="space-y-3 text-sm">
              <li><span className="text-white/60">Для 14–18 лет</span></li>
              <li><span className="text-white/60">Вся Россия</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-white/40">
          © {new Date().getFullYear()} РаботаТинейджеров. Все права защищены.
        </div>
      </div>
    </footer>
  )
}
