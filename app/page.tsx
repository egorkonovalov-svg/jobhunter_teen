import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES, JOB_TYPES } from '@/lib/constants'

const TYPE_COLORS: Record<string, string> = {
  internship: 'bg-teal-light text-teal',
  'part-time': 'bg-[#FFF8ED] text-[#96722B]',
  gig: 'bg-[#F0F0E8] text-[#5C5C2A]',
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
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight heading-display">
            Найди свою первую работу
          </h1>
          <p className="text-xl text-white/60 mb-8 max-w-2xl mx-auto">
            Стажировки, подработки и разовые задания для подростков 14–18 лет по всей России
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-xl mx-auto">
            <Link
              href="/jobs"
              className="flex-1 px-6 py-3 bg-gold text-white rounded-xl font-semibold hover:bg-gold-hover transition-all duration-300 text-center"
            >
              Найти вакансию
            </Link>
            <Link
              href="/post-job"
              className="flex-1 px-6 py-3 border-2 border-white/30 text-white rounded-xl font-semibold hover:bg-white/10 transition-all duration-300 text-center"
            >
              Разместить вакансию
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-warm-gray border-b border-border py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-6 text-center">
            <div className="flex items-center gap-2 text-text-secondary">
              <span className="text-2xl font-bold text-gold heading-display">1 200+</span>
              <span className="text-sm">вакансий</span>
            </div>
            <div className="w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2 text-text-secondary">
              <span className="text-2xl font-bold text-gold heading-display">50+</span>
              <span className="text-sm">городов</span>
            </div>
            <div className="w-px bg-border hidden sm:block" />
            <div className="flex items-center gap-2 text-text-secondary">
              <span className="text-2xl font-bold text-gold heading-display">Для 14–18 лет</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-midnight heading-display">Свежие вакансии</h2>
          <Link href="/jobs" className="text-gold hover:text-gold-hover font-medium text-sm link-underline transition-all duration-300">
            Все вакансии
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-12 text-text-secondary">
            <p className="text-lg">Вакансии скоро появятся!</p>
            <p className="text-sm mt-1">Станьте первым работодателем на платформе</p>
            <Link href="/post-job" className="mt-4 inline-block text-gold font-medium hover:underline transition-all duration-300">
              Разместить вакансию
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {jobs.map(job => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="bg-white border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-warm-gray rounded-lg flex items-center justify-center text-lg font-bold text-midnight">
                    {job.company.charAt(0)}
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${TYPE_COLORS[job.type] ?? 'bg-warm-gray text-text-secondary'}`}>
                    {JOB_TYPES[job.type] ?? job.type}
                  </span>
                </div>
                <h3 className="font-semibold text-midnight group-hover:text-gold transition-all duration-300 mb-1">
                  {job.title}
                </h3>
                <p className="text-sm text-text-secondary mb-3">{job.company}</p>
                <div className="flex items-center gap-3 text-xs text-text-secondary">
                  <span>{job.city}</span>
                  {job.salary_min && (
                    <span>
                      {job.salary_min.toLocaleString('ru')}
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
          <h2 className="text-2xl font-bold text-midnight mb-8 text-center heading-display">
            Поиск по категориям
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CATEGORIES.map(category => (
              <Link
                key={category}
                href={`/jobs?category=${encodeURIComponent(category)}`}
                className="flex flex-col items-center gap-2 p-4 rounded-lg border border-border hover:border-gold hover:bg-gold/5 transition-all duration-300 text-center group"
              >
                <span className="w-10 h-10 bg-warm-gray rounded-lg flex items-center justify-center text-lg font-bold text-midnight">
                  {category.charAt(0)}
                </span>
                <span className="text-xs font-medium text-text-secondary group-hover:text-gold transition-all duration-300">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Employer CTA */}
      <section className="bg-navy text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-3 heading-display">Ищете сотрудников?</h2>
          <p className="text-white/60 text-lg mb-8">
            Разместите вакансию бесплатно и найдите мотивированных молодых специалистов
          </p>
          <Link
            href="/post-job"
            className="inline-block px-8 py-3 bg-gold text-white rounded-xl font-semibold hover:bg-gold-hover transition-all duration-300"
          >
            Разместите вакансию бесплатно
          </Link>
        </div>
      </section>
    </div>
  )
}
