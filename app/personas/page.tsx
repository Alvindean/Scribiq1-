import { getPersonas, getCollaborations } from '@/lib/bible'
import { SectionHeader } from '@/components/ui/SectionHeader'
import PersonaBrowser from '@/components/PersonaBrowser'
import PersonaCollabBuilder from '@/components/PersonaCollabBuilder'

export default async function PersonasPage() {
  const [personas, collaborations] = await Promise.all([getPersonas(), getCollaborations()])
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <SectionHeader
        label="Personas"
        title="24 Writing Voices"
        subtitle="Find your voice. Master it. Break it. Rebuild it."
      />
      <PersonaBrowser personas={personas} />
      <div className="mt-20">
        <SectionHeader
          label="Collaboration"
          title="Persona Bands"
          subtitle="What happens when two or more voices work together in the same piece."
          className="mb-8"
        />
        <PersonaCollabBuilder personas={personas} collaborations={collaborations} />
      </div>
    </div>
  )
}
