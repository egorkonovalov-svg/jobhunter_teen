import Link from 'next/link'

export default function JobNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p className="heading-display text-8xl font-bold text-border mb-4">404</p>
      <h1 className="text-2xl font-bold text-midnight mb-2">Вакансия не найдена</h1>
      <p className="text-text-secondary mb-8">
        Эта вакансия была удалена или стала неактивной
      </p>
      <Link
        href="/jobs"
        className="inline-block px-6 py-3 bg-midnight text-white rounded-lg font-semibold hover:bg-navy hover:scale-[1.02] transition-all duration-300"
      >
        Все вакансии
      </Link>
    </div>
  )
}
