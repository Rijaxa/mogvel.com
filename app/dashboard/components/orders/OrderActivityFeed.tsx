import { ClipboardList, Clock } from 'lucide-react';

interface ActivityEvent {
    title: string;
    date: string;
    actor: 'System' | 'Vendor';
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
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-slate-500">{event.date}</span>
                                <span className="text-[10px] px-2 py-0.5 bg-slate-200 rounded text-slate-600 font-bold">{event.actor}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
