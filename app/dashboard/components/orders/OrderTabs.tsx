import { cn } from "@/lib/utils";

interface OrderTabsProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
    counts: {
        ongoing: number;
        inProgress: number;
        completed: number;
    };
}

export default function OrderTabs({ activeTab, onTabChange, counts }: OrderTabsProps) {
    const tabs = [
        { id: 'ongoing', label: 'Ongoing Orders', count: counts.ongoing },
        { id: 'inProgress', label: 'In Progress', count: counts.inProgress },
        { id: 'completed', label: 'Completed Orders', count: counts.completed },
    ];

    return (
        <div className="bg-slate-100 p-1 rounded-xl inline-flex mb-8 overflow-x-auto max-w-full">
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    className={cn(
                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                        activeTab === tab.id
                            ? "bg-white text-slate-900 shadow-sm"
                            : "text-slate-500 hover:text-slate-700"
                    )}
                >
                    {tab.label}
                    <span className={cn(
                        "inline-flex items-center justify-center w-5 h-5 rounded-md text-xs",
                        activeTab === tab.id ? "bg-brand text-white" : "bg-slate-200 text-slate-600"
                    )}>
                        {tab.count}
                    </span>
                </button>
            ))}
        </div>
    );
}
