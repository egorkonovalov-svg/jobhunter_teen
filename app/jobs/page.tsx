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
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Вакансий не найдено</h3>
        <p className="text-gray-500 mb-4">Попробуйте другой город или измените фильтры</p>
        <Link href="/jobs" className="text-indigo-600 font-medium hover:underline">
          Сбросить все фильтры
        </Link>
      </div>
    )
  }

  return (
    <div>
      <p className="text-sm text-gray-500 mb-4">
        Найдено вакансий: <span className="font-semibold text-gray-700">{count}</span>
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
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              ← Назад
            </Link>
          )}
          <span className="text-sm text-gray-500">
            Страница {page} из {totalPages}
          </span>
          {page < totalPages && (
            <Link
              href={buildPageUrl(page + 1)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-indigo-400 hover:text-indigo-600 transition-colors"
            >
              Далее →
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
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Вакансии для подростков</h1>

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
                <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                  <div className="flex gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-lg" />
                    <div className="flex-1">
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 rounded w-1/3" />
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
