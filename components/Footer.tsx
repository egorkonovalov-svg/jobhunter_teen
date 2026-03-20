import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-1 mb-3">
              <span className="text-lg font-bold text-[#4F46E5]">Работа</span>
              <span className="text-lg font-bold text-gray-900">Тинейджеров</span>
            </div>
            <p className="text-sm text-gray-500">
              Работа для подростков 14–18 лет по всей России
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Вакансии</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/jobs" className="hover:text-[#4F46E5]">Все вакансии</Link></li>
              <li><Link href="/jobs?type=internship" className="hover:text-[#4F46E5]">Стажировки</Link></li>
              <li><Link href="/jobs?type=part-time" className="hover:text-[#4F46E5]">Подработка</Link></li>
              <li><Link href="/jobs?type=gig" className="hover:text-[#4F46E5]">Разовая работа</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Работодателям</h3>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/post-job" className="hover:text-[#4F46E5]">Разместить вакансию</Link></li>
              <li><Link href="/dashboard" className="hover:text-[#4F46E5]">Личный кабинет</Link></li>
              <li><Link href="/auth/register" className="hover:text-[#4F46E5]">Регистрация</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-sm text-gray-400">
          Для 14–18 лет | Россия | © {new Date().getFullYear()} РаботаТинейджеров
        </div>
      </div>
    </footer>
  )
}
