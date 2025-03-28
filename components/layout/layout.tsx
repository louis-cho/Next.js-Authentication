import Header from '@/components/layout/header'

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <main className="px-6 py-10">{children}</main>
        </div>
    )
}