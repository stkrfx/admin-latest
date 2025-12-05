'use client';

import { useState, useEffect } from 'react';
import { getUsers, createUser, deleteUser } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, MoreHorizontal, Trash2, Loader2, RefreshCw } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [newUser, setNewUser] = useState(null); // To show credentials
  const [search, setSearch] = useState("");

  const loadUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data || []);
    } catch (error) {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setIsCreating(true);
    const formData = new FormData(e.target);
    
    // Prepare plain object for the server action
    const userData = {
        name: formData.get('name'),
        email: formData.get('email'),
        role: formData.get('role'),
        password: "temp-password-" + Math.random().toString(36).slice(-6) // Auto-generate temp password
    };

    const res = await createUser(userData);
    
    setIsCreating(false);
    
    if (res.success) {
      setNewUser({ email: userData.email, password: userData.password });
      setIsCreateOpen(false);
      toast.success("User created successfully!");
      loadUsers();
    } else {
      toast.error(res.error || "Failed to create user");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) return;
    
    const res = await deleteUser(id);
    if (res.success) {
        toast.success("User deleted");
        loadUsers();
    } else {
        toast.error("Failed to delete user");
    }
  };

  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">User Management</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-slate-900"><Plus className="mr-2 h-4 w-4" /> Create User</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create New User</DialogTitle></DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4 py-4">
              <Input name="name" placeholder="Full Name" required />
              <Input name="email" type="email" placeholder="Email Address" required />
              <Select name="role" defaultValue="user">
                <SelectTrigger><SelectValue placeholder="Select Role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="expert">Expert</SelectItem>
                  <SelectItem value="organisation">Organisation</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" className="w-full bg-slate-900" disabled={isCreating}>
                {isCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Create & Generate Credentials"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {newUser && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-900 animate-in fade-in slide-in-from-top-2">
          <h4 className="font-bold mb-1">User Created Successfully</h4>
          <p className="text-sm mb-2">Please copy these credentials and share them with the user:</p>
          <div className="bg-white p-3 rounded border border-green-100 font-mono text-sm">
            <p><strong>Email:</strong> {newUser.email}</p>
            <p><strong>Password:</strong> {newUser.password}</p>
          </div>
          <Button variant="ghost" size="sm" className="mt-2 text-green-700 hover:text-green-800 hover:bg-green-100" onClick={() => setNewUser(null)}>
            Dismiss
          </Button>
        </div>
      )}

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
          <Input 
            placeholder="Search users..." 
            className="pl-8 bg-white" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button variant="outline" size="icon" onClick={loadUsers} disabled={loading}>
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
        </Button>
      </div>

      <div className="border rounded-md bg-white overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                        <Loader2 className="h-6 w-6 animate-spin mx-auto text-slate-400" />
                    </TableCell>
                </TableRow>
            ) : filteredUsers.length === 0 ? (
                <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center text-slate-500">
                        No users found.
                    </TableCell>
                </TableRow>
            ) : (
                filteredUsers.map((user) => (
                <TableRow key={user._id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize 
                            ${user.role === 'expert' ? 'bg-purple-100 text-purple-800' : 
                              user.role === 'organisation' ? 'bg-blue-100 text-blue-800' : 
                              'bg-slate-100 text-slate-800'}`}>
                            {user.role}
                        </span>
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs">
                        {new Date(user.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(user.email)}>
                            Copy Email
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 focus:text-red-600 focus:bg-red-50" onClick={() => handleDelete(user._id)}>
                            <Trash2 className="mr-2 h-4 w-4" /> Delete User
                        </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    </TableCell>
                </TableRow>
                ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}