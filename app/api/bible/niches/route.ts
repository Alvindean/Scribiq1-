import { NextResponse } from 'next/server'
import { getNiches } from '@/lib/bible'

export async function GET() {
  const niches = await getNiches()
  const slim = niches.map(({ id, name }) => ({ id, name }))
  return NextResponse.json(slim)
}
