import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-7xl mb-6">🔍</div>
      <h1 className="text-4xl font-bold text-gray-900 mb-3">404</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">Страница не найдена</h2>
      <p className="text-gray-500 mb-8 max-w-md">
        Похоже, такой страницы не существует. Возможно, вакансия была удалена или ссылка неверна.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/jobs"
          className="px-6 py-3 bg-[#4F46E5] text-white rounded-xl font-semibold hover:bg-[#4338CA] transition-colors"
        >
          Посмотреть вакансии
        </Link>
        <Link
          href="/"
          className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
        >
          На главную
        </Link>
      </div>
    </div>
  )
}
