import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import JobCard from '@/components/JobCard'
import JobFilters from '@/components/JobFilters'
import SearchBar from '@/components/SearchBar'
import Link from 'next/link'

const PAGE_SIZE = 12

interface SearchParams {
  city?: string
  category?: string
  type?: string
  query?: string
  page?: string
}

async function JobsList({ searchParams }: { searchParams: SearchParams }) {
  const supabase = await createClient()
  const page = parseInt(searchParams.page ?? '1')
  const from = (page - 1) * PAGE_SIZE
  const to = from + PAGE_SIZE - 1

  let queryBuilder = supabase
    .from('jobs')
    .select('*', { count: 'exact' })
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .range(from, to)

  if (searchParams.city) queryBuilder = queryBuilder.eq('city', searchParams.city)
  if (searchParams.category) queryBuilder = queryBuilder.eq('category', searchParams.category)
  if (searchParams.type) queryBuilder = queryBuilder.eq('type', searchParams.type)
  if (searchParams.query) queryBuilder = queryBuilder.ilike('title', `%${searchParams.query}%`)

  const { data: jobs, count } = await queryBuilder

  const totalPages = Math.ceil((count ?? 0) / PAGE_SIZE)

  function buildPageUrl(p: number) {
    const params = new URLSearchParams()
    if (searchParams.city) params.set('city', searchParams.city)
    if (searchParams.category) params.set('category', searchParams.category)
    if (searchParams.type) params.set('type', searchParams.type)
    if (searchParams.query) params.set('query', searchParams.query)
    params.set('page', String(p))
    return `/jobs?${params.toString()}`
  }

  if (!jobs || jobs.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-lg font-semibold text-midnight mb-2 heading-display">Вакансий не найдено</h3>
        <p className="text-text-secondary mb-4">Попробуйте другой город или измените фильтры</p>
        <Link href="/jobs" className="text-gold font-medium hover:underline transition-all duration-300">
          Сбросить все фильтры
        </Link>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-text-secondary mb-4">
        Найдено вакансий: <span className="font-semibold text-midnight">{count}</span>
      </p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {jobs.map(job => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-8">
          {page > 1 && (
            <Link
              href={buildPageUrl(page - 1)}
              className="px-4 py-2 border border-border rounded-lg text-sm text-midnight hover:border-gold hover:text-gold transition-all duration-300"
            >
              Назад
            </Link>
          )}
          <span className="text-sm text-text-secondary">
            Страница {page} из {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildPageUrl(page + 1)}
              className="px-4 py-2 border border-border rounded-lg text-sm text-midnight hover:border-gold hover:text-gold transition-all duration-300"
            >
              Далее
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold text-midnight mb-6 heading-display">Вакансии для подростков</h1>

      {/* Search Bar */}
      <div className="mb-6">
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 shrink-0">
          <Suspense>
            <JobFilters />
          </Suspense>
        </div>

        {/* Job Listings */}
        <div className="flex-1 min-w-0">
          <Suspense fallback={
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg border border-border p-5 animate-pulse">
                  <div className="flex gap-3 mb-3">
                    <div className="w-10 h-10 bg-warm-gray rounded-lg" />
                    <div className="flex-1">
                      <div className="h-3 bg-warm-gray rounded w-1/2 mb-2" />
                      <div className="h-4 bg-warm-gray rounded w-3/4" />
                    </div>
                  </div>
                  <div className="h-3 bg-warm-gray rounded w-1/3" />
                </div>
              ))}
            </div>
          }>
            <JobsList searchParams={params} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
