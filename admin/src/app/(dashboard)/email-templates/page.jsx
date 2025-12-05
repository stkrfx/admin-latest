'use client';

import { useState, useEffect } from 'react';
import { getTemplates, saveTemplate, deleteTemplate } from "@/actions/templates";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    const data = await getTemplates();
    setTemplates(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
        _id: editing?._id,
        name: formData.get("name"),
        subject: formData.get("subject"),
        htmlContent: formData.get("htmlContent"),
        description: formData.get("description"),
    };
    
    await saveTemplate(data);
    setIsOpen(false);
    toast.success("Template Saved");
    load();
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure?")) return;
    await deleteTemplate(id);
    toast.success("Deleted");
    load();
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Email Templates</h1>
        <Button onClick={() => { setEditing(null); setIsOpen(true); }} className="bg-slate-900">
            <Plus className="mr-2 h-4 w-4" /> New Template
        </Button>
      </div>

      <div className="flex-1 overflow-auto border rounded-lg">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Key Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {templates.map(t => (
                    <TableRow key={t._id}>
                        <TableCell className="font-mono text-xs font-bold">{t.name}</TableCell>
                        <TableCell>{t.subject}</TableCell>
                        <TableCell className="text-slate-500">{t.description}</TableCell>
                        <TableCell className="text-right space-x-2">
                            <Button variant="ghost" size="icon" onClick={() => { setEditing(t); setIsOpen(true); }}>
                                <Pencil className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => handleDelete(t._id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
            <DialogHeader><DialogTitle>{editing ? 'Edit' : 'Create'} Template</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div className="grid grid-cols-2 gap-4">
                    <Input name="name" placeholder="Template Key (e.g. welcome_mail)" defaultValue={editing?.name} required />
                    <Input name="subject" placeholder="Email Subject" defaultValue={editing?.subject} required />
                </div>
                <Input name="description" placeholder="Internal Description" defaultValue={editing?.description} />
                <div className="flex-1 flex gap-4 min-h-0">
                    <Textarea 
                        name="htmlContent" 
                        className="flex-1 font-mono resize-none h-full" 
                        placeholder="<html>...</html>" 
                        defaultValue={editing?.htmlContent} 
                        required 
                    />
                    {/* Simple Preview */}
                    <div className="flex-1 border rounded bg-slate-50 p-2 overflow-auto">
                        <p className="text-xs text-slate-400 mb-2 text-center uppercase">Preview (Approx)</p>
                        <div dangerouslySetInnerHTML={{ __html: editing?.htmlContent || '' }} />
                    </div>
                </div>
                <Button type="submit">Save Template</Button>
            </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}