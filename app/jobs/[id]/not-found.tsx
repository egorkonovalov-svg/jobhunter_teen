import Link from 'next/link'

export default function JobNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <h1 className="text-4xl font-bold text-midnight/10 mb-2 heading-display">404</h1>
      <h2 className="text-2xl font-bold text-midnight mb-2 heading-display">Вакансия не найдена</h2>
      <p className="text-text-secondary mb-6">
        Эта вакансия была удалена или стала неактивной
      </p>
      <Link
        href="/jobs"
        className="inline-block px-6 py-3 bg-gold text-white rounded-xl font-semibold hover:bg-gold-hover transition-all duration-300"
      >
        Все вакансии
      </Link>
    </div>
  )
}
