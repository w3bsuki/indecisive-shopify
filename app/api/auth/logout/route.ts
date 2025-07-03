import { logoutAction } from '@/app/actions/auth'
import { NextRequest } from 'next/server'

export async function POST(_request: NextRequest) {
  await logoutAction()
  // logoutAction handles the redirect
}