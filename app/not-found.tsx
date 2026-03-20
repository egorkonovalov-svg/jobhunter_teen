import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="heading-display text-8xl font-bold text-border mb-6">404</p>
      <h1 className="text-2xl font-bold text-midnight mb-2">Страница не найдена</h1>
      <p className="text-text-secondary mb-8 max-w-md">
        Похоже, такой страницы не существует. Возможно, вакансия была удалена или ссылка неверна.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/jobs"
          className="px-6 py-3 bg-midnight text-white rounded-lg font-semibold hover:bg-navy hover:scale-[1.02] transition-all duration-300"
        >
          Посмотреть вакансии
        </Link>
        <Link
          href="/"
          className="px-6 py-3 border border-midnight text-midnight rounded-lg font-semibold hover:bg-midnight hover:text-white transition-all duration-300"
        >
          На главную
        </Link>
      </div>
    </div>
  )
}
