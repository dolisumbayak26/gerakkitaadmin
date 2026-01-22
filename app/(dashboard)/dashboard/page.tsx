import { redirect } from 'next/navigation'
import { getAdminSession } from '@/app/actions/auth'

export default async function RootPage() {
    const session = await getAdminSession()

    if (!session) {
        redirect('/login')
    }

    // Redirect authenticated users to main dashboard
    redirect('/')
}
