import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { CATEGORIES, JOB_TYPES } from '@/lib/constants'

const TYPE_BADGE: Record<string, string> = {
  internship: 'bg-teal-light text-teal border border-teal/20',
  'part-time': 'bg-amber-50 text-amber-800 border border-amber-200/50',
  gig: 'bg-stone-100 text-stone-700 border border-stone-200/50',
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
      <section className="bg-navy text-white py-24 lg:py-32 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(201,169,110,0.08),transparent_70%)]" />
        <div className="max-w-4xl mx-auto text-center relative">
          <h1 className="heading-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-[1.05] tracking-tight">
            Найди свою первую работу
          </h1>
          <p className="text-lg text-white/70 mb-10 max-w-xl mx-auto leading-relaxed">
            Стажировки, подработки и разовые задания для подростков 14–18 лет по всей России
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <Link
              href="/jobs"
              className="px-8 py-3.5 bg-gold text-midnight rounded-lg font-semibold hover:bg-gold-hover hover:scale-[1.02] transition-all duration-300 text-center"
            >
              Найти вакансии
            </Link>
            <Link
              href="/post-job"
              className="px-8 py-3.5 border border-white/30 text-white rounded-lg font-semibold hover:bg-white/10 transition-all duration-300 text-center"
            >
              Для работодателей
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-warm-white border-y border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 divide-x divide-border text-center">
            <div className="px-4">
              <p className="heading-display text-3xl font-bold text-midnight">1 200+</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mt-1">вакансий</p>
            </div>
            <div className="px-4">
              <p className="heading-display text-3xl font-bold text-midnight">50+</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mt-1">городов</p>
            </div>
            <div className="px-4">
              <p className="heading-display text-3xl font-bold text-midnight">14–18</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mt-1">лет</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-end justify-between mb-10">
          <h2 className="heading-display text-3xl font-bold text-midnight">Свежие вакансии</h2>
          <Link href="/jobs" className="text-sm font-medium text-gold hover:text-gold-hover link-underline transition-colors duration-300">
            Смотреть все →
          </Link>
        </div>

        {jobs.length === 0 ? (
          <div className="text-center py-16 text-text-secondary">
            <p className="text-lg">Вакансии скоро появятся</p>
            <p className="text-sm mt-2 text-text-tertiary">Станьте первым работодателем на платформе</p>
            <Link href="/post-job" className="mt-6 inline-block text-gold font-medium hover:text-gold-hover link-underline transition-colors duration-300">
              Разместить вакансию →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map(job => (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="bg-white border border-border rounded-lg p-5 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-midnight text-white rounded-lg flex items-center justify-center text-sm font-bold">
                    {job.company.charAt(0)}
                  </div>
                  <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${TYPE_BADGE[job.type] ?? 'bg-warm-gray text-text-secondary border border-border'}`}>
                    {JOB_TYPES[job.type] ?? job.type}
                  </span>
                </div>
                <h3 className="font-semibold text-midnight mb-1 group-hover:underline decoration-gold/40 underline-offset-2">
                  {job.title}
                </h3>
                <p className="text-xs text-text-secondary uppercase tracking-wider mb-3">{job.company}</p>
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
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="heading-display text-3xl font-bold text-midnight mb-10 text-center">
            Поиск по категориям
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {CATEGORIES.map(category => (
              <Link
                key={category}
                href={`/jobs?category=${encodeURIComponent(category)}`}
                className="flex flex-col items-center gap-3 p-6 rounded-lg border border-border bg-white hover:border-midnight/20 hover:shadow-[0_4px_12px_rgba(0,0,0,0.06)] hover:-translate-y-0.5 transition-all duration-300 text-center group"
              >
                <span className="text-xs font-semibold text-text-secondary group-hover:text-midnight uppercase tracking-wider leading-tight">
                  {category}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Employer CTA */}
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="heading-display text-3xl md:text-4xl font-bold mb-4 tracking-tight">Ищете сотрудников?</h2>
          <p className="text-white/60 text-lg mb-10 max-w-lg mx-auto">
            Разместите вакансию бесплатно и найдите мотивированных молодых специалистов
          </p>
          <Link
            href="/post-job"
            className="inline-block px-8 py-3.5 bg-gold text-midnight rounded-lg font-semibold hover:bg-gold-hover hover:scale-[1.02] transition-all duration-300"
          >
            Разместите вакансию бесплатно
          </Link>
        </div>
      </section>
    </div>
  )
}
