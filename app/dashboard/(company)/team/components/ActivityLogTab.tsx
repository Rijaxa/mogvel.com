'use client';

import { useEffect, useState } from 'react';
import { Clock, UserPlus, UserMinus, Shield, AlertCircle } from 'lucide-react';
import { getTeamActivity } from '@/actions/team';

export default function ActivityLogTab() {
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadActivities();
    }, []);

    async function loadActivities() {
        const result = await getTeamActivity();
        if (!result.error && result.activities) {
            setActivities(result.activities);
        }
        setLoading(false);
    }

    function getActivityIcon(action: string) {
        switch (action) {
            case 'invited':
                return <UserPlus className="w-5 h-5" />;
            case 'deleted':
                return <UserMinus className="w-5 h-5" />;
            case 'updated_role':
                return <Shield className="w-5 h-5" />;
            case 'suspended':
            case 'activated':
                return <AlertCircle className="w-5 h-5" />;
            default:
                return <Clock className="w-5 h-5" />;
        }
    }

    function getActivityColor(action: string) {
        switch (action) {
            case 'invited':
                return 'bg-green-100 text-green-600';
            case 'deleted':
                return 'bg-red-100 text-red-600';
            case 'updated_role':
                return 'bg-yellow-100 text-yellow-600';
            case 'suspended':
                return 'bg-red-100 text-red-600';
            case 'activated':
                return 'bg-green-100 text-green-600';
            default:
                return 'bg-blue-100 text-blue-600';
        }
    }

    function getActivityText(activity: any) {
        const details = activity.details ? JSON.parse(activity.details) : {};

        switch (activity.action) {
            case 'invited':
                return `${activity.actorName} invited ${activity.targetName} as ${details.role}`;
            case 'updated_role':
                return `${activity.actorName} updated ${activity.targetName}'s role from ${details.oldRole} to ${details.newRole}`;
            case 'suspended':
                return `${activity.actorName} suspended ${activity.targetName}`;
            case 'activated':
                return `${activity.actorName} activated ${activity.targetName}`;
            case 'deleted':
                return `${activity.actorName} removed ${activity.targetName}`;
            default:
                return `${activity.actorName} performed an action`;
        }
    }

    function getTimeAgo(date: string) {
        const now = new Date();
        const activityDate = new Date(date);
        const diffMs = now.getTime() - activityDate.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        return activityDate.toLocaleDateString();
    }

    if (loading) {
        return (
            <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-brand border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div>
            <h2 className="text-xl font-semibold text-slate-900 mb-6">Recent Activity</h2>

            {activities.length === 0 ? (
                <div className="text-center py-12 bg-slate-50 rounded-lg">
                    <Clock className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500">No activity recorded yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {activities.map((activity) => (
                        <div
                            key={activity.id}
                            className="flex gap-4 p-4 bg-white border border-slate-200 rounded-lg hover:shadow-sm transition-shadow"
                        >
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getActivityColor(activity.action)}`}>
                                {getActivityIcon(activity.action)}
                            </div>
                            <div className="flex-1">
                                <p className="text-slate-900">{getActivityText(activity)}</p>
                                <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                                    <Clock className="w-3 h-3" />
                                    <span>{getTimeAgo(activity.createdAt)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
