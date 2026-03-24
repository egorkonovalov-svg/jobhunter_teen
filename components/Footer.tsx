import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-navy">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1 mb-3">
              <span className="text-lg font-bold text-gold heading-display">JobHunter</span>
              <span className="text-lg font-bold text-white heading-display">-Teen</span>
            </div>
            <p className="text-sm text-white/60">
              Работа для подростков 14–18 лет по всей России
            </p>
          </div>

          {/* Вакансии */}
          <div>
            <h3 className="font-semibold text-white mb-3">Вакансии</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/jobs" className="hover:text-gold transition-all duration-300">Все вакансии</Link></li>
              <li><Link href="/jobs?type=internship" className="hover:text-gold transition-all duration-300">Стажировки</Link></li>
              <li><Link href="/jobs?type=part-time" className="hover:text-gold transition-all duration-300">Подработка</Link></li>
              <li><Link href="/jobs?type=gig" className="hover:text-gold transition-all duration-300">Разовая работа</Link></li>
            </ul>
          </div>

          {/* Работодателям */}
          <div>
            <h3 className="font-semibold text-white mb-3">Работодателям</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><Link href="/post-job" className="hover:text-gold transition-all duration-300">Разместить вакансию</Link></li>
              <li><Link href="/dashboard" className="hover:text-gold transition-all duration-300">Личный кабинет</Link></li>
              <li><Link href="/auth/register" className="hover:text-gold transition-all duration-300">Регистрация</Link></li>
            </ul>
          </div>

          {/* О платформе */}
          <div>
            <h3 className="font-semibold text-white mb-3">О платформе</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li><span className="hover:text-gold transition-all duration-300 cursor-default">О нас</span></li>
              <li><span className="hover:text-gold transition-all duration-300 cursor-default">Для родителей</span></li>
              <li><span className="hover:text-gold transition-all duration-300 cursor-default">Поддержка</span></li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 text-center text-sm text-white/40">
          Для 14–18 лет | Россия | © {new Date().getFullYear()} JobHunter-Teen
        </div>
      </div>
    </footer>
  )
}
