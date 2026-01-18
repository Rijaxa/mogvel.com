'use client';

import { Bell, Check, Package, MessageSquare, AlertTriangle, X } from 'lucide-react';
import { useRef, useEffect, useState } from 'react';

interface VendorNotificationsProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function VendorNotifications({ isOpen, onClose }: VendorNotificationsProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [items, setItems] = useState([
        {
            icon: Package,
            title: 'New order from Acme Corporation',
            desc: 'Office Supplies x12 - ₾850',
            time: '5 min ago',
            color: 'text-brand bg-teal-50',
            isNew: true
        },
        {
            icon: MessageSquare,
            title: 'Client feedback received from TechStart Inc',
            desc: '5-star rating with positive review',
            time: '1h ago',
            color: 'text-blue-500 bg-blue-50',
            isNew: true
        },
        {
            icon: AlertTriangle,
            title: 'Low stock alert: Hand Sanitizer 500ml',
            desc: '',
            time: '',
            color: 'text-yellow-600 bg-yellow-50',
            isNew: true
        }
    ]);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                onClose();
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleMarkAllRead = () => {
        setItems(items.map(item => ({ ...item, isNew: false })));
    };

    const unreadCount = items.filter(i => i.isNew).length;

    return (
        <div ref={ref} className="absolute top-16 right-4 w-96 bg-white rounded-2xl shadow-xl z-50 border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                <div>
                    <h3 className="font-bold text-slate-900">Notifications</h3>
                    <p className="text-xs text-slate-500">{unreadCount} unread</p>
                </div>
                <button
                    onClick={handleMarkAllRead}
                    className="text-xs font-bold text-brand hover:text-brand/80 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={unreadCount === 0}
                >
                    Mark all read
                </button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
                {items.map((item, idx) => (
                    <div key={idx} className="p-4 hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0 relative group cursor-pointer">
                        <div className="flex gap-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                                <item.icon className="w-5 h-5" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900 leading-snug pr-8">{item.title}</p>
                                {item.desc && <p className="text-xs text-slate-500 mt-1">{item.desc}</p>}
                                {item.time && <p className="text-[10px] text-slate-400 mt-2">{item.time}</p>}
                            </div>
                        </div>
                        {item.isNew && (
                            <span className="absolute top-4 right-4 bg-brand text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                                New
                            </span>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-3 border-t border-slate-100 text-center">
                <button
                    onClick={() => console.log('Navigate to all notifications')}
                    className="text-sm font-bold text-brand hover:text-brand/80 w-full py-1"
                >
                    View All Notifications
                </button>
            </div>
        </div>
    );
}
