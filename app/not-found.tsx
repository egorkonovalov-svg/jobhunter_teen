import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-8xl font-bold text-midnight/10 mb-2 heading-display">404</h1>
      <h2 className="text-xl font-semibold text-midnight mb-2 heading-display">Страница не найдена</h2>
      <p className="text-text-secondary mb-8 max-w-md">
        Похоже, такой страницы не существует. Возможно, вакансия была удалена или ссылка неверна.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/jobs"
          className="px-6 py-3 bg-gold text-white rounded-xl font-semibold hover:bg-gold-hover transition-all duration-300"
        >
          Посмотреть вакансии
        </Link>
        <Link
          href="/"
          className="px-6 py-3 border border-border text-midnight rounded-xl font-semibold hover:bg-warm-gray transition-all duration-300"
        >
          На главную
        </Link>
      </div>
    </div>
  )
}
