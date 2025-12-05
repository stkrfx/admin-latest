'use client';
import { useEffect, useState } from 'react';
import { getDashboardStats } from "@/actions/stats";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Shield, Building2, UserPlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    getDashboardStats().then(setStats);
  }, []);

  if (!stats) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Total Users" value={stats.cards.totalUsers} icon={Users} />
            <StatCard title="Experts" value={stats.cards.totalExperts} icon={Shield} />
            <StatCard title="Organisations" value={stats.cards.totalOrgs} icon={Building2} />
            <StatCard title="Admins" value={stats.cards.totalAdmins} icon={UserPlus} />
        </div>

        <Card>
            <CardHeader><CardTitle>User Distribution</CardTitle></CardHeader>
            <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={stats.graph}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Bar dataKey="total" fill="#0f172a" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-slate-500">{title}</CardTitle>
        <Icon className="h-4 w-4 text-slate-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );
}