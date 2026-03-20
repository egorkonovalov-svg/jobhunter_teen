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
        className="flex-1 px-5 py-3 bg-white border border-border rounded-lg text-midnight text-base placeholder-text-tertiary focus:outline-none focus:border-midnight focus:ring-1 focus:ring-midnight transition-all duration-300"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-midnight text-white rounded-lg hover:bg-navy font-medium transition-all duration-300 hover:scale-[1.02]"
      >
        Найти
      </button>
    </form>
  )
}
