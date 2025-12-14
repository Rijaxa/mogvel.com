'use client';

import { CheckCircle, Clock, Truck } from 'lucide-react';

export default function RecentActivity() {
    const activities = [
        { text: 'Order #2847 approved by Manager', time: '10 mins ago', icon: CheckCircle, color: 'text-green-500 bg-green-50' },
        { text: 'New stock request from Kitchen', time: '1 hour ago', icon: Clock, color: 'text-orange-500 bg-orange-50' },
        { text: 'Delivery for Order #2845 arrived', time: '2 hours ago', icon: Truck, color: 'text-blue-500 bg-blue-50' },
    ];

    return (
        <div className="bg-white rounded-2xl p-6 border border-slate-100">
            <h3 className="font-bold text-slate-900 mb-6">Recent Activity</h3>
            <div className="space-y-6">
                {activities.map((item, idx) => (
                    <div key={idx} className="flex gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${item.color}`}>
                            <item.icon className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-900">{item.text}</p>
                            <p className="text-xs text-slate-500 mt-1">{item.time}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
