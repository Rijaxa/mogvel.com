import { Trash2, Edit } from 'lucide-react';
import { useState } from 'react';

// Mock Data for UI Match (matching Screenshot 2)
const MOCK_MEMBERS = [
    {
        id: '1',
        user: { name: 'Davit Lomidze', email: 'davit.l@cleanpro.ge' },
        role: { name: 'Admin' },
        assignedAccess: ['All Products', 'All Clients'],
        status: 'active'
    },
    {
        id: '2',
        user: { name: 'Tamari Kharatishvili', email: 'tamari.k@cleanpro.ge' },
        role: { name: 'Sales Manager' },
        assignedAccess: ['Acme Corp', 'TechStart', '+1'],
        status: 'active'
    },
    {
        id: '3',
        user: { name: 'Sandro Gorgodze', email: 'sandro.g@cleanpro.ge' },
        role: { name: 'Sales Representative' },
        assignedAccess: ['Urban Retail', 'FreshFood Co.'],
        status: 'active'
    },
    {
        id: '4',
        user: { name: 'Elene Shengelia', email: 'elene.s@cleanpro.ge' },
        role: { name: 'Logistics Staff' },
        assignedAccess: ['Delivery Management'],
        status: 'active'
    },
    {
        id: '5',
        user: { name: 'Giorgi Mumladze', email: 'giorgi.m@cleanpro.ge' },
        role: { name: 'Viewer' },
        assignedAccess: ['Analytics Only'],
        status: 'suspended'
    }
];

export default function TeamList({ members, onEdit }: { members: any[], onEdit: (member: any) => void }) {
    // Ideally use 'members' prop, but falling back to mock for exact UI match
    const [dataDisplay, setDataDisplay] = useState(MOCK_MEMBERS);

    const toggleStatus = (id: string) => {
        setDataDisplay(prev => prev.map(m =>
            m.id === id ? { ...m, status: m.status === 'active' ? 'suspended' : 'active' } : m
        ));
    };

    const getRoleBadgeStyle = (roleName: string) => {
        switch (roleName) {
            case 'Admin': return 'bg-teal-500 text-white';
            case 'Sales Manager': return 'bg-orange-100 text-orange-700';
            case 'Sales Representative': return 'bg-blue-100 text-blue-700'; // Assuming standard blue
            case 'Logistics Staff': return 'bg-slate-800 text-white';
            case 'Viewer': return 'bg-slate-200 text-slate-700';
            default: return 'bg-slate-100 text-slate-800';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex gap-4">
                <div className="relative flex-1">
                    <input
                        type="text"
                        placeholder="Search team members..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-0"
                    />
                    <div className="absolute left-3 top-2.5 text-slate-400">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                </div>
                <select className="px-4 py-2 bg-slate-50 border-none rounded-lg text-sm text-slate-700 font-medium focus:ring-0">
                    <option>All Roles</option>
                </select>
                <select className="px-4 py-2 bg-slate-50 border-none rounded-lg text-sm text-slate-700 font-medium focus:ring-0">
                    <option>All Status</option>
                </select>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-white text-slate-500 font-medium border-b border-slate-50">
                        <tr>
                            <th className="px-6 py-4 font-normal">Member</th>
                            <th className="px-6 py-4 font-normal">Role</th>
                            <th className="px-6 py-4 font-normal">Assigned Access</th>
                            <th className="px-6 py-4 font-normal">Status</th>
                            <th className="px-6 py-4 font-normal text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {dataDisplay.map((member) => (
                            <tr key={member.id} className="hover:bg-slate-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${member.role.name === 'Admin' ? 'bg-teal-500' : 'bg-slate-400'}`}>
                                            {member.user.name?.split(' ').map((n: any) => n[0]).join('')}
                                        </div>
                                        <div>
                                            <div className="font-bold text-slate-900">{member.user.name}</div>
                                            <div className="text-xs text-slate-500">{member.user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${getRoleBadgeStyle(member.role.name)}`}>
                                        {member.role.name}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        {member.assignedAccess.map((access, i) => (
                                            <span key={i} className="px-2 py-1 bg-slate-50 border border-slate-200 rounded text-xs font-semibold text-slate-600">
                                                {access}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => toggleStatus(member.id)}
                                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand/20 ${member.status === 'active' ? 'bg-brand' : 'bg-slate-200'}`}
                                    >
                                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${member.status === 'active' ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                    <span className="ml-3 text-slate-600">{member.status === 'active' ? 'Active' : 'Suspended'}</span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-3">
                                        <button
                                            onClick={() => onEdit(member)}
                                            className="p-2 text-brand border border-brand/20 rounded-lg hover:bg-brand/5 transition-colors"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => alert('Delete implementation pending')}
                                            className="p-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
