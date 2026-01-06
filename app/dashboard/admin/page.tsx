import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Shield, User, MapPin, Phone, Globe } from "lucide-react";

export default async function AdminPage() {
    const session = await auth();

    // Strict access control
    if (session?.user?.email !== 'purtseladze.nino@gmail.com') {
        redirect('/dashboard/company');
    }

    const users = db.getAllUsers();

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-brand" />
                        Super Admin Dashboard
                    </h1>
                    <p className="text-slate-600">Manage all registered companies and users.</p>
                </div>
                <div className="bg-slate-100 px-4 py-2 rounded-lg font-medium text-slate-700">
                    Total Users: {users.length}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 font-semibold text-slate-700">Company ID</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">User / Email</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Company Details</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Status</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user.id || user.email} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4 font-mono text-slate-500">
                                        {user.id}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                                                {user.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-slate-900">{user.name}</div>
                                                <div className="text-slate-500 text-xs">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.companyDetails?.businessName ? (
                                            <div className="space-y-1">
                                                <div className="font-medium text-slate-900">{user.companyDetails.businessName}</div>
                                                <div className="flex flex-col gap-0.5 text-xs text-slate-500">
                                                    {user.companyDetails.address && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin className="w-3 h-3" /> {user.companyDetails.address}
                                                        </span>
                                                    )}
                                                    {user.companyDetails.phone && (
                                                        <span className="flex items-center gap-1">
                                                            <Phone className="w-3 h-3" /> {user.companyDetails.phone}
                                                        </span>
                                                    )}
                                                    {user.companyDetails.website && (
                                                        <span className="flex items-center gap-1">
                                                            <Globe className="w-3 h-3" /> {user.companyDetails.website}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic">No details provided</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {user.companyDetails?.isProfileComplete ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                                Complete
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
                                                Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${user.role === 'admin'
                                                ? 'bg-purple-50 text-purple-700 border-purple-100'
                                                : 'bg-slate-50 text-slate-600 border-slate-100'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
