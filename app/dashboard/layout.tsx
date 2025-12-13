import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <Sidebar />
            <TopBar />
            <main className="ml-64 p-8">
                {children}
            </main>
        </div>
    );
}
