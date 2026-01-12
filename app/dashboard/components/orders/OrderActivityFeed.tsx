import { ClipboardList, Clock, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActivityEvent {
    title: string;
    date: string;
    actor: 'System' | 'Vendor' | 'Company';
    file?: {
        name: string;
        url: string;
        size?: string;
    };
}

interface OrderActivityFeedProps {
    events: ActivityEvent[];
}

export default function OrderActivityFeed({ events }: OrderActivityFeedProps) {
    return (
        <div className="bg-white rounded-xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <ClipboardList className="w-5 h-5 text-brand" />
                <h4 className="font-bold text-slate-900 text-sm">Order Activity Feed</h4>
            </div>

            <div className="p-4 space-y-4">
                {events.map((event, index) => (
                    <div key={index} className="bg-slate-50 border border-slate-100 rounded-lg p-4 flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                        <div className="flex-1">
                            <p className="font-bold text-slate-900 text-sm mb-1">{event.title}</p>

                            {event.file && (
                                <button
                                    onClick={() => alert(`Downloading ${event.file?.name}...`)}
                                    className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-cyan-50 border border-cyan-100 rounded-lg text-brand text-[10px] font-bold hover:bg-cyan-100 transition-colors w-fit shadow-xs group"
                                >
                                    <Download className="w-3 h-3 group-hover:scale-110 transition-transform" />
                                    {event.file.name}
                                </button>
                            )}

                            <div className="flex items-center gap-3 mt-3">
                                <span className="text-[10px] text-slate-500">{event.date}</span>
                                <span className={cn(
                                    "text-[10px] px-2 py-0.5 rounded font-bold",
                                    event.actor === 'System' ? "bg-slate-200 text-slate-600" :
                                        event.actor === 'Vendor' ? "bg-brand/10 text-brand" :
                                            "bg-cyan-100 text-cyan-700" // Company (Buyer) actor
                                )}>
                                    {event.actor}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
