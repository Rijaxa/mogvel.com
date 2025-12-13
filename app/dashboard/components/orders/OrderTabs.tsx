import { cn } from "@/lib/utils";

interface TabItem {
    label: string;
    count: number;
    active?: boolean;
}

const tabs: TabItem[] = [
    { label: 'Ongoing Orders', count: 3, active: true },
    { label: 'In Progress', count: 2, active: false },
    { label: 'Completed Orders', count: 2, active: false },
];

export default function OrderTabs() {
    return (
        <div className="bg-slate-100 p-1 rounded-xl inline-flex mb-8">
            {tabs.map((tab, index) => (
                <button
                    key={index}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all",
                        tab.active
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    {tab.label}
                    <span className={cn(
                        "inline-flex items-center justify-center w-5 h-5 rounded-md text-xs",
                        tab.active ? "bg-brand text-white" : "bg-slate-200 text-slate-600"
                    )}>
                        {tab.count}
                    </span>
                </button>
            ))}
        </div>
    );
}
