import { NextResponse } from 'next/server'
import { getEras } from '@/lib/bible'

export async function GET() {
  const eras = await getEras()
  const slim = eras.map(({ id, name, period }) => ({ id, name, period }))
  return NextResponse.json(slim)
}
