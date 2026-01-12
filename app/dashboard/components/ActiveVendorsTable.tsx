import { Eye } from 'lucide-react';

const vendors = [
    { name: 'CleanPro Supplies', rating: 4.8, stability: 'Stable', stock: 'High Stock', sla: '99.2%', verified: true },
    { name: 'OfficeMax Direct', rating: 4.5, stability: 'Increasing', stock: 'Medium', sla: '96.8%', verified: true },
    { name: 'HygieneCo', rating: 4.9, stability: 'Decreasing', stock: 'High Stock', sla: '98.5%', verified: true },
    { name: 'Industrial Supply Co', rating: 4.3, stability: 'Stable', stock: 'Low Stock', sla: '94.2%', verified: false },
];

export default function ActiveVendorsTable() {
    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-xs font-bold text-slate-900 uppercase border-b border-slate-100">
                    <tr>
                        <th className="py-4 px-4">Vendor Name</th>
                        <th className="py-4 px-4">Rating</th>
                        <th className="py-4 px-4">Price Stability</th>
                        <th className="py-4 px-4">Stock Level</th>
                        <th className="py-4 px-4">Delivery SLA</th>
                        <th className="py-4 px-4 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {vendors.map((vendor, index) => (
                        <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                            <td className="py-4 px-4 font-medium text-slate-900 flex items-center gap-2">
                                {vendor.name}
                                {vendor.verified && (
                                    <span className="bg-cyan-50 text-cyan-600 text-[10px] px-1.5 py-0.5 rounded font-bold">Verified</span>
                                )}
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-1 text-slate-900 font-bold">
                                    <span className="text-yellow-400">★</span> {vendor.rating}
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <div className="flex items-center gap-2 font-medium">
                                    <div className={`w-2 h-2 rounded-full ${vendor.stability === 'Stable' ? 'bg-teal-400' :
                                            vendor.stability === 'Increasing' ? 'bg-red-400' : 'bg-green-400'
                                        }`} />
                                    {vendor.stability}
                                </div>
                            </td>
                            <td className="py-4 px-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${vendor.stock === 'High Stock' ? 'bg-green-100 text-green-700' :
                                        vendor.stock === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                                            'bg-red-100 text-red-700'
                                    }`}>
                                    {vendor.stock}
                                </span>
                            </td>
                            <td className="py-4 px-4 text-cyan-500 font-bold">{vendor.sla}</td>
                            <td className="py-4 px-4 text-right">
                                <button className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 hover:bg-white hover:shadow-sm transition-all bg-white">
                                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                                    View Offer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
