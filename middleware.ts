import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
    const sessionCookie = request.cookies.get('admin_session')

    // Check if user has valid session
    const hasValidSession = sessionCookie ? isSessionValid(sessionCookie.value) : false

    // If not authenticated and trying to access protected routes
    if (!hasValidSession && !request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // If authenticated and trying to access login page
    if (hasValidSession && request.nextUrl.pathname.startsWith('/login')) {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

function isSessionValid(sessionValue: string): boolean {
    try {
        const session = JSON.parse(sessionValue)
        return session.expiresAt > Date.now()
    } catch {
        return false
    }
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|favicon.ico|public).*)'],
}
