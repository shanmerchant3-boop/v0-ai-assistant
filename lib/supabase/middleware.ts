import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  // Just pass through requests without Supabase session management
  return NextResponse.next({ request })
}
