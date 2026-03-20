import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES, JOB_TYPES } from '@/lib/constants'

const CATEGORY_ICONS: Record<string, string> = {
  'IT и технологии': '💻',
  'Курьер и доставка': '🚴',
  'Промоутер': '📣',
  'Репетиторство': '📚',
  'Творчество и дизайн': '🎨',
  'Общепит': '🍕',
  'Торговля': '🛍️',
  'Спорт и фитнес': '⚽',
  'Уход за животными': '🐾',
  'Другое': '💼',
}

const TYPE_COLORS: Record<string, string> = {
  internship: 'bg-indigo-100 text-indigo-700',
  'part-time': 'bg-cyan-100 text-cyan-700',
  gig: 'bg-green-100 text-green-700',
}

export default async function HomePage() {
  const supabase = await createClient()
  const { data: featuredJobs } = await supabase
    .from('jobs')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6)

  const jobs = featuredJobs ?? []

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
            Найди свою первую работу
          </h1>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Стажировки, подработки и разовые задания для подростков 14–18 лет по всей России
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
            <Link
              href="/jobs"
              className="flex-1 px-6 py-3 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-colors text-center"
            >
              Найти вакансию →
            </Link>
            <Link
              href="/post-job"
              className="flex-1 px-6 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white/10 transition-colors text-center"
            >
              Разместить вакансию
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-center">
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-2xl font-bold text-indigo-600">1 200+</span>
              <span className="text-sm">вакансий</span>
            </div>
            <div className="w-px bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-2xl font-bold text-indigo-600">50+</span>
              <span className="text-sm">городов</span>
            </div>
            <div className="w-px bg-gray-200 hidden sm:block" />
            <div className="flex items-center gap-2 text-gray-600">
              <span className="text-2xl font-bold text-indigo-600">Для 14–18 лет</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Свежие вакансии</h2>
          <Link href="/jobs" className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">
            Все вакансии →
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-lg">Вакансии скоро появятся!</p>
            <p className="text-sm mt-1">Станьте первым работодателем на платформе</p>
            <Link href="/post-job" className="mt-4 inline-block text-indigo-600 font-medium hover:underline">
              Разместить вакансию →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map(job => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="bg-white rounded-xl border border-gray-200 p-5 hover:border-indigo-300 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-lg font-bold text-indigo-600">
                    {job.company.charAt(0)}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${TYPE_COLORS[job.type] ?? 'bg-gray-100 text-gray-700'}`}>
                    {JOB_TYPES[job.type] ?? job.type}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors mb-1">
                  {job.title}
                </h3>
                <p className="text-sm text-gray-500 mb-3">{job.company}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>📍 {job.city}</span>
                  {job.salary_min && (
                    <span>
                      💰 {job.salary_min.toLocaleString('ru')}
                      {job.salary_max ? `–${job.salary_max.toLocaleString('ru')}` : '+'} ₽/мес
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Category Tiles */}
      <section className="bg-white py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Поиск по категориям
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CATEGORIES.map(category => (
              <Link
                key={category}
                href={`/jobs?category=${encodeURIComponent(category)}`}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all text-center group"
              >
                <span className="text-3xl">{CATEGORY_ICONS[category] ?? '💼'}</span>
                <span className="text-xs font-medium text-gray-700 group-hover:text-indigo-700">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Employer CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3">Ищете сотрудников?</h2>
          <p className="text-indigo-200 text-lg mb-8">
            Разместите вакансию бесплатно и найдите мотивированных молодых специалистов
          </p>
          <Link
            href="/post-job"
            className="inline-block px-8 py-3 bg-white text-indigo-700 rounded-xl font-semibold hover:bg-indigo-50 transition-colors"
          >
            Разместите вакансию бесплатно →
          </Link>
        </div>
      </section>
    </div>
  )
}
