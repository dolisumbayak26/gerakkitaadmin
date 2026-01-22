import { getAdminSession } from '@/app/actions/auth'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Header } from '@/components/dashboard/Header'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getAdminSession()

    if (!session) {
        redirect('/login')
    }

    return (
        <div className="min-h-screen bg-slate-950">
            <Sidebar />

            <div className="pl-64">
                <Header />

                <main className="p-8">
                    {children}
                </main>
            </div>
        </div>
    )
}
