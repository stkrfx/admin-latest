'use client';
import { useState, useEffect } from 'react';
import { getAdmins, createUser, deleteUser } from "@/actions/users";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const load = async () => {
    const data = await getAdmins();
    setAdmins(data);
  };

  useEffect(() => { load(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const res = await createUser({
        name: formData.get("name"),
        email: formData.get("email"),
        password: formData.get("password"),
        role: 'admin'
    });
    
    if(res.success) {
        toast.success("Admin Created");
        setIsOpen(false);
        load();
    } else {
        toast.error(res.error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Manage Admins</h1>
        <Button onClick={() => setIsOpen(true)} className="bg-slate-900"><Plus className="mr-2 h-4 w-4" /> Add Admin</Button>
      </div>
      
      <div className="border rounded-md">
        <Table>
            <TableHeader>
                <TableRow><TableHead>Name</TableHead><TableHead>Email</TableHead><TableHead className="text-right">Action</TableHead></TableRow>
            </TableHeader>
            <TableBody>
                {admins.map(admin => (
                    <TableRow key={admin._id}>
                        <TableCell>{admin.name}</TableCell>
                        <TableCell>{admin.email}</TableCell>
                        <TableCell className="text-right">
                            <Button size="icon" variant="ghost" className="text-red-500" onClick={async () => {
                                await deleteUser(admin._id);
                                load();
                            }}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
            <DialogHeader><DialogTitle>Add New Admin</DialogTitle></DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
                <Input name="name" placeholder="Name" required />
                <Input name="email" type="email" placeholder="Email" required />
                <Input name="password" type="password" placeholder="Password" required />
                <Button type="submit" className="w-full">Create Admin</Button>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}