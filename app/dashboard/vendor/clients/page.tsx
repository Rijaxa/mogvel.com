'use client';

import ClientRow from '@/app/dashboard/components/vendor/clients/ClientRow';

export default function VendorClientsPage() {
    return (
        <div className="max-w-6xl mx-auto pb-20">
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-slate-900 mb-2">Clients</h1>
                <p className="text-slate-500">Manage client relationships and view purchase history</p>
            </div>

            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <ClientRow
                    id="acme"
                    name="Acme Corporation"
                    initials="AC"
                    initialsColor="bg-brand"
                    tier="Gold"
                    orders="45 orders"
                    avgOrder="₾2,500 avg. order"
                    rating={4.9}
                    isActive={true}
                />
                <ClientRow
                    id="techstart"
                    name="TechStart Inc"
                    initials="TI"
                    initialsColor="bg-teal-500"
                    tier="Silver"
                    orders="32 orders"
                    avgOrder="₾1,800 avg. order"
                    rating={4.7}
                    isActive={true}
                />
                <ClientRow
                    id="global"
                    name="Global Industries"
                    initials="GI"
                    initialsColor="bg-blue-500"
                    tier="Gold"
                    orders="28 orders"
                    avgOrder="₾3,200 avg. order"
                    rating={4.8}
                    isActive={true}
                />
                <ClientRow
                    id="urban"
                    name="Urban Retail Co"
                    initials="UR"
                    initialsColor="bg-cyan-500"
                    tier="Bronze"
                    orders="19 orders"
                    avgOrder="₾1,200 avg. order"
                    rating={4.6}
                    isActive={true}
                />
                <ClientRow
                    id="freshfood"
                    name="FreshFood Markets"
                    initials="FM"
                    initialsColor="bg-emerald-500"
                    tier="Bronze"
                    orders="15 orders"
                    avgOrder="₾950 avg. order"
                    rating={4.5}
                    isActive={true}
                />
            </div>
        </div>
    );
}
