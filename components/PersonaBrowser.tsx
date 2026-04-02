'use client'

import { useState } from 'react'
import { PersonaCard } from '@/components/PersonaCard'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/cn'
import type { Persona } from '@/lib/bible'

interface PersonaBrowserProps {
  personas: Persona[]
}

type FilterTab = 'all' | 'jung-12' | 'copywriting-extension' | 'literary-extension'

const tabs: { label: string; value: FilterTab }[] = [
  { label: 'All', value: 'all' },
  { label: 'Jung 12', value: 'jung-12' },
  { label: 'Copywriting', value: 'copywriting-extension' },
  { label: 'Literary', value: 'literary-extension' },
]

// Map filter tabs to actual archetype values in the data
const tabArchetypeMap: Record<FilterTab, string[]> = {
  all: [],
  'jung-12': ['authority', 'rebel', 'expert', 'companion', 'narrator', 'thinker'],
  'copywriting-extension': ['rebel', 'expert', 'authority'],
  'literary-extension': ['narrator', 'companion', 'thinker'],
}

export default function PersonaBrowser({ personas }: PersonaBrowserProps) {
  const [activeTab, setActiveTab] = useState<FilterTab>('all')
  const [search, setSearch] = useState('')

  const filtered = personas.filter((p) => {
    const matchesTab =
      activeTab === 'all' || tabArchetypeMap[activeTab].includes(p.archetype)
    const matchesSearch =
      search.trim() === '' ||
      p.name.toLowerCase().includes(search.toLowerCase())
    return matchesTab && matchesSearch
  })

  const handleReset = () => {
    setActiveTab('all')
    setSearch('')
  }

  return (
    <div className="mt-10">
      {/* Filter + search row */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-8">
        {/* Filter tabs */}
        <div className="flex gap-1 bg-surface border border-white/5 rounded-xl p-1">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'px-3 py-1.5 text-sm font-sans rounded-lg transition-all duration-150',
                activeTab === tab.value
                  ? 'bg-brand/15 text-brand border border-brand/30'
                  : 'text-[#8888A8] hover:text-[#E8E8F0] hover:bg-white/5'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-64">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8888A8]"
            width="14"
            height="14"
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          >
            <circle cx="6.5" cy="6.5" r="4.5" />
            <line x1="10.5" y1="10.5" x2="14" y2="14" />
          </svg>
          <input
            type="text"
            placeholder="Search personas…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm font-sans bg-surface border border-white/5 rounded-xl text-[#E8E8F0] placeholder:text-[#8888A8]/60 focus:outline-none focus:border-brand/40 focus:ring-1 focus:ring-brand/20 transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((persona) => (
            <PersonaCard key={persona.id} persona={persona} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
          <p className="font-sans text-[#8888A8] text-base">
            No personas match{search ? ` "${search}"` : ''}.
          </p>
          <Button variant="secondary" size="sm" onClick={handleReset}>
            Reset filters
          </Button>
        </div>
      )}
    </div>
  )
}
