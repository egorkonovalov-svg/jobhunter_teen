'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, FormEvent } from 'react'

export default function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState(searchParams.get('query') ?? '')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(searchParams.toString())
    if (query) {
      params.set('query', query)
    } else {
      params.delete('query')
    }
    params.delete('page')
    router.push(`/jobs?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Найти вакансию..."
        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4F46E5] focus:border-transparent"
      />
      <button
        type="submit"
        className="px-5 py-2.5 bg-[#4F46E5] text-white rounded-lg hover:bg-[#4338CA] font-medium transition-colors"
      >
        Найти
      </button>
    </form>
  )
}
