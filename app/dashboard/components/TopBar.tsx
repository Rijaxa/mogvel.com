import { Bell, Search, ChevronDown, Building2 } from 'lucide-react';

export default function TopBar() {
    return (
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-40 ml-64">
            <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <Building2 className="w-4 h-4 text-slate-500" />
                    Headquarters - Tbilisi
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
            </div>

            <div className="flex items-center flex-1 max-w-xl mx-8">
                <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search vendors, items, or invoices..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand/20 transition-all placeholder:text-slate-400"
                    />
                </div>
            </div>

            <div className="flex items-center gap-4">
                <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-full transition-colors">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
                </button>

                <div className="h-8 w-px bg-slate-200" />

                <button className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-full pr-3 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center font-medium text-sm">
                        AC
                    </div>
                    <span className="text-sm font-medium text-slate-700">Acme Corp</span>
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>
            </div>
        </header>
    );
}
