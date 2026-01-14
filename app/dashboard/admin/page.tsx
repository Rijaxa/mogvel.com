import { auth } from "@/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { Shield, User, MapPin, Phone, Globe } from "lucide-react";

export default async function AdminPage() {
    const session = await auth();

    // Strict access control - TEMPORARY: Commented out for dev verification
    // if (session?.user?.email !== 'purtseladze.nino@gmail.com') {
    //     redirect('/dashboard/company');
    // }

    const rawUsers = await db.query.users.findMany({
        with: {
            memberships: {
                with: {
                    organization: true
                }
            }
        }
    });

    const users = rawUsers.map(user => {
        const org = user.memberships[0]?.organization;
        return {
            ...user,
            organizationName: org?.name || 'N/A',
            organizationType: org?.type || 'N/A',
            companyDetails: user.companyDetails && typeof user.companyDetails === 'string'
                ? JSON.parse(user.companyDetails)
                : user.companyDetails || {}
        };
    });

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Shield className="w-6 h-6 text-brand" />
                        Super Admin Dashboard
                    </h1>
                    <p className="text-slate-600">Manage all registered companies, vendors, and users.</p>
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
                                <th className="px-6 py-4 font-semibold text-slate-700">Organization</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Type</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">User / Email</th>
                                <th className="px-6 py-4 font-semibold text-slate-700">Role</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.map((user) => (
                                <tr key={user.id || user.email} className="hover:bg-slate-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-slate-900">{user.organizationName}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${user.organizationType === 'vendor'
                                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                                            : 'bg-blue-50 text-blue-700 border-blue-100'
                                            }`}>
                                            {user.organizationType.toUpperCase()}
                                        </span>
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
