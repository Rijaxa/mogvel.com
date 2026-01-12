import { Filter, ArrowUpDown } from 'lucide-react';

interface FilterSortBarProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
    sortOption: string;
    onSortChange: (option: string) => void;
    totalCount: number;
    shownCount: number;
}

export default function FilterSortBar({
    categories,
    selectedCategory,
    onSelectCategory,
    sortOption,
    onSortChange,
    totalCount,
    shownCount
}: FilterSortBarProps) {
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
            <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
                <span className="text-slate-900 font-bold text-sm whitespace-nowrap">Filter & Sort:</span>

                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <select
                        value={selectedCategory}
                        onChange={(e) => onSelectCategory(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/50"
                    >
                        <option value="All">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div className="relative">
                    <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    <select
                        value={sortOption}
                        onChange={(e) => onSortChange(e.target.value)}
                        className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand/50"
                    >
                        <option value="stockLevel">Sort by: Stock Level (Asc)</option>
                        <option value="stockLevelDesc">Sort by: Stock Level (Desc)</option>
                        <option value="name">Sort by: Name</option>
                    </select>
                </div>
            </div>

            <span className="text-slate-500 text-sm font-medium whitespace-nowrap">
                Showing {shownCount} of {totalCount} products
            </span>
        </div>
    );
}
