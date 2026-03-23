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
        className="flex-1 px-4 py-2.5 border border-border rounded-lg text-midnight placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all duration-300"
      />
      <button
        type="submit"
        className="px-5 py-2.5 bg-gold text-white rounded-lg hover:bg-gold-hover font-medium transition-all duration-300"
      >
        Найти
      </button>
    </form>
  )
}
