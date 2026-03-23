'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { CITIES, CATEGORIES, JOB_TYPES } from '@/lib/constants'

export default function JobFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (value) {
      params.set(key, value)
    } else {
      params.delete(key)
    }
    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }

  const currentCity = searchParams.get('city') ?? ''
  const currentType = searchParams.get('type') ?? ''
  const currentCategory = searchParams.get('category') ?? ''

  function clearAll() {
    router.push('/jobs')
  }

  const hasFilters = currentCity || currentType || currentCategory

  return (
    <aside className="bg-white border border-border rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-midnight heading-display">Фильтры</h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-gold hover:underline transition-all duration-300"
          >
            Сбросить
          </button>
        )}
      </div>

      {/* City */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Город</label>
        <select
          value={currentCity}
          onChange={e => updateFilter('city', e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm text-midnight focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
        >
          <option value="">Все города</option>
          {CITIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Job Type */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Тип работы</p>
        <div className="space-y-2">
          {Object.entries(JOB_TYPES).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value={value}
                checked={currentType === value}
                onChange={() => updateFilter('type', currentType === value ? '' : value)}
                className="accent-gold"
              />
              <span className="text-sm text-midnight">{label}</span>
            </label>
          ))}
          {currentType && (
            <button
              onClick={() => updateFilter('type', '')}
              className="text-xs text-text-tertiary hover:text-text-secondary mt-1 transition-all duration-300"
            >
              Сбросить тип
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">Категория</label>
        <select
          value={currentCategory}
          onChange={e => updateFilter('category', e.target.value)}
          className="w-full px-3 py-2 border border-border rounded-lg text-sm text-midnight focus:outline-none focus:ring-2 focus:ring-gold transition-all duration-300"
        >
          <option value="">Все категории</option>
          {CATEGORIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>
    </aside>
  )
}
