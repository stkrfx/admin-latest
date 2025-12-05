'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getUsers } from "@/actions/users";
import { DataTable } from "@/components/ui/data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function UsersPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await getUsers();
        setData(res || []);
      } catch (error) {
        toast.error("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">User Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage users, experts, and organizations.
          </p>
        </div>
        <Button asChild className="bg-slate-900 hover:bg-slate-800 shadow-sm">
          <Link href="/users/create">
            <Plus className="mr-2 h-4 w-4" />
            Create User
          </Link>
        </Button>
      </div>

      <DataTable 
        columns={columns} 
        data={data} 
        loading={loading}
        searchKey="name" 
      />
    </div>
  );
}