'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    LineChart,
    Line,
} from 'recharts';

const benchmarkData = [
    { name: 'Avg Spend', comp: 125, market: 155 },
    { name: 'Delivery Time', comp: 2, market: 3 },
    { name: 'Order Frequency', comp: 15, market: 12 },
    { name: 'Vendor Count', comp: 25, market: 30 },
];

const forecastData = [
    { name: 'Oct', actual: 4200, predicted: 4500 },
    { name: 'Nov', actual: 4500, predicted: 4700 },
    { name: 'Dec', actual: 4600, predicted: 5000 },
    { name: 'Jan', predicted: 4800 },
];

export function BenchmarkingChart() {
    return (
        <div className="h-64 mt-4">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={benchmarkData} barGap={0}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                    />
                    <Tooltip
                        cursor={{ fill: '#F1F5F9' }}
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Bar dataKey="market" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Market Average" barSize={32} />
                    <Bar dataKey="comp" fill="#17BEBB" radius={[4, 4, 0, 0]} name="Your Company" barSize={32} />
                </BarChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-6 mt-2 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-slate-300 rounded-sm" /> Market Average
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-brand rounded-sm" /> Your Company
                </div>
            </div>
        </div>
    );
}

export function ForecastingChart() {
    return (
        <div className="h-64 mt-4 relative">
            {/* Custom tooltip-like label for predicted spend based on screenshot */}
            <div className="absolute top-[40%] left-[45%] bg-white border border-brand/20 text-brand text-xs font-bold px-3 py-1.5 rounded shadow-sm z-10">
                Predicted Spend : 5200
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={forecastData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748B', fontSize: 12 }}
                        domain={[0, 6000]}
                    />
                    <Tooltip />
                    <Line
                        type="monotone"
                        dataKey="actual"
                        stroke="#0F172A"
                        strokeWidth={2}
                        dot={{ r: 4, fill: '#0F172A' }}
                        activeDot={{ r: 6 }}
                        name="Actual Spend"
                    />
                    <Line
                        type="monotone"
                        dataKey="predicted"
                        stroke="#17BEBB"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={{ r: 4, fill: '#17BEBB' }}
                        name="Predicted Spend"
                    />
                </LineChart>
            </ResponsiveContainer>

            <div className="flex justify-center gap-6 mt-2 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-slate-900" /> Actual Spend
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-4 h-[2px] border-t-2 border-dashed border-brand" /> Predicted Spend
                </div>
            </div>
        </div>
    );
}
