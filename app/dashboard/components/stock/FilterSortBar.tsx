import { Filter, ArrowUpDown } from 'lucide-react';

export default function FilterSortBar() {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3">
                <span className="text-slate-900 font-bold text-sm">Filter & Sort:</span>

                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <Filter className="w-4 h-4 text-slate-500" />
                    All Categories
                </button>

                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                    <ArrowUpDown className="w-4 h-4 text-slate-500" />
                    Sort by: Stock Level
                </button>
            </div>

            <span className="text-slate-500 text-sm font-medium">
                Showing 5 of 5 products
            </span>
        </div>
    );
}
