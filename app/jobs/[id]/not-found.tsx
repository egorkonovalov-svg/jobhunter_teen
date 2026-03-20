import Link from 'next/link'

export default function JobNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="text-6xl mb-5">😕</div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Вакансия не найдена</h1>
      <p className="text-gray-500 mb-6">
        Эта вакансия была удалена или стала неактивной
      </p>
      <Link
        href="/jobs"
        className="inline-block px-6 py-3 bg-[#4F46E5] text-white rounded-xl font-semibold hover:bg-[#4338CA] transition-colors"
      >
        Все вакансии →
      </Link>
    </div>
  )
}
