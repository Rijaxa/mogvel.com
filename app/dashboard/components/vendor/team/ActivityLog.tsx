'use client';

import { UserPlus, Edit, Trash2 } from 'lucide-react';

export default function ActivityLog() {
    // Mock Data based on Screenshot 1
    const activities = [
        {
            id: 1,
            type: 'invite',
            user: 'Davit Lomidze',
            action: 'invited',
            target: 'Tamari Kharatishvili',
            role: 'as Sales Manager',
            time: '3 hours ago',
            icon: UserPlus,
            color: 'bg-green-100 text-green-600'
        },
        {
            id: 2,
            type: 'update',
            user: 'Tamari Kharatishvili',
            action: 'updated',
            target: "Sandro Gorgodze's client assignments",
            role: '',
            time: '1 day ago',
            icon: Edit,
            color: 'bg-yellow-100 text-yellow-600'
        },
        {
            id: 3,
            type: 'suspend',
            user: 'Davit Lomidze',
            action: 'suspended',
            target: 'Giorgi Mumladze',
            role: '',
            time: '3 days ago',
            icon: Trash2,
            color: 'bg-red-100 text-red-600'
        }
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h3 className="text-sm font-medium text-slate-900 mb-6">Recent Activity</h3>

            <div className="relative">
                {/* Vertical Line */}
                <div className="absolute left-4 top-4 bottom-4 w-px bg-slate-200" />

                <div className="space-y-8">
                    {activities.map((activity) => (
                        <div key={activity.id} className="relative flex gap-4">
                            <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center ${activity.color} ring-4 ring-white`}>
                                <activity.icon className="w-4 h-4" />
                            </div>
                            <div className="pt-1">
                                <p className="text-slate-900 text-sm">
                                    <span className="font-bold">{activity.user}</span>{' '}
                                    <span className="text-slate-600">{activity.action}</span>{' '}
                                    <span className="font-bold">{activity.target}</span>{' '}
                                    {activity.role && <span className="text-slate-600">{activity.role}</span>}
                                </p>
                                <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <span className="w-3 h-3 rounded-full border border-slate-300 flex items-center justify-center">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                                    </span>
                                    {activity.time}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
