import { NextResponse } from 'next/server'
import { getPersonas } from '@/lib/bible'

export async function GET() {
  const personas = await getPersonas()
  const slim = personas.map(({ id, name }) => ({ id, name }))
  return NextResponse.json(slim)
}
