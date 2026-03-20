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
    <aside className="bg-white rounded-xl border border-gray-200 p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-gray-900">Фильтры</h2>
        {hasFilters && (
          <button
            onClick={clearAll}
            className="text-xs text-indigo-600 hover:underline"
          >
            Сбросить
          </button>
        )}
      </div>

      {/* City */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Город</label>
        <select
          value={currentCity}
          onChange={e => updateFilter('city', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
        >
          <option value="">Все города</option>
          {CITIES.map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      {/* Job Type */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Тип работы</p>
        <div className="space-y-2">
          {Object.entries(JOB_TYPES).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="type"
                value={value}
                checked={currentType === value}
                onChange={() => updateFilter('type', currentType === value ? '' : value)}
                className="text-indigo-600"
              />
              <span className="text-sm text-gray-700">{label}</span>
            </label>
          ))}
          {currentType && (
            <button
              onClick={() => updateFilter('type', '')}
              className="text-xs text-gray-400 hover:text-gray-600 mt-1"
            >
              Сбросить тип
            </button>
          )}
        </div>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Категория</label>
        <select
          value={currentCategory}
          onChange={e => updateFilter('category', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#4F46E5]"
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
