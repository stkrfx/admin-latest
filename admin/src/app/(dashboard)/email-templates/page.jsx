'use client';

import { useState, useEffect } from 'react';
import { getTemplates, saveTemplate, deleteTemplate } from "@/actions/templates";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Loader2, ArrowLeft, Save, Code, Eye } from "lucide-react";
import { toast } from "sonner";

export default function EmailTemplatesPage() {
  const [view, setView] = useState('list'); // 'list' | 'editor'
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTemplate, setEditingTemplate] = useState(null); // The template object being edited

  // --- Data Loading ---
  const load = async () => {
    setLoading(true);
    const data = await getTemplates();
    setTemplates(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  // --- Handlers ---
  const handleEdit = (template) => {
    setEditingTemplate(template); // If null, it's create mode
    setView('editor');
  };

  const handleDelete = async (id) => {
    if(!confirm("Are you sure? This action cannot be undone.")) return;
    await deleteTemplate(id);
    toast.success("Template deleted");
    load();
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const data = {
        _id: editingTemplate?._id,
        name: formData.get("name"),
        subject: formData.get("subject"),
        description: formData.get("description"),
        htmlContent: formData.get("htmlContent"),
    };
    
    const res = await saveTemplate(data);
    
    if (res?.error) {
        toast.error(res.error);
    } else {
        toast.success("Template Saved Successfully");
        setView('list');
        load();
    }
  };

  // --- RENDER: Editor View ---
  if (view === 'editor') {
    return (
      <form onSubmit={handleSave} className="flex flex-col h-[calc(100vh-80px)] -m-6 bg-slate-50">
        {/* Editor Header */}
        <div className="h-16 border-b bg-white flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-4">
                <Button type="button" variant="ghost" size="sm" onClick={() => setView('list')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                </Button>
                <h2 className="text-lg font-bold">{editingTemplate ? `Edit: ${editingTemplate.name}` : 'New Template'}</h2>
            </div>
            <Button type="submit" className="bg-slate-900">
                <Save className="mr-2 h-4 w-4" /> Save Template
            </Button>
        </div>

        {/* Editor Body */}
        <div className="flex-1 flex overflow-hidden">
            {/* Left: Inputs & Code */}
            <div className="w-1/2 flex flex-col border-r bg-white">
                <div className="p-6 border-b space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Template Key</label>
                            <Input name="name" placeholder="e.g. welcome_email" defaultValue={editingTemplate?.name} required className="font-mono text-sm" />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase">Subject Line</label>
                            <Input name="subject" placeholder="Welcome to Mind Namo!" defaultValue={editingTemplate?.subject} required />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-500 uppercase">Description</label>
                        <Input name="description" placeholder="Internal use only" defaultValue={editingTemplate?.description} />
                    </div>
                </div>
                
                <div className="flex-1 flex flex-col min-h-0">
                    <div className="bg-slate-100 px-4 py-2 border-b flex items-center gap-2 text-xs font-bold text-slate-600">
                        <Code className="h-3 w-3" /> HTML SOURCE
                    </div>
                    <Textarea 
                        name="htmlContent" 
                        className="flex-1 resize-none border-0 rounded-none focus-visible:ring-0 p-4 font-mono text-sm leading-relaxed" 
                        placeholder="<html><body>...</body></html>" 
                        defaultValue={editingTemplate?.htmlContent} 
                        required 
                        // Simple state binding to update preview on type could be added here if needed, 
                        // but for simplicity we let the user type and it updates on 'change' if we wired it up.
                        // For a live preview, we need controlled state:
                        onChange={(e) => setEditingTemplate(prev => ({...prev, htmlContent: e.target.value}))}
                    />
                </div>
            </div>

            {/* Right: Preview */}
            <div className="w-1/2 bg-slate-100 flex flex-col">
                <div className="bg-white px-4 py-3 border-b flex items-center gap-2 text-xs font-bold text-slate-600 h-[52px] shrink-0">
                    <Eye className="h-3 w-3" /> LIVE PREVIEW
                </div>
                <div className="flex-1 p-8 overflow-auto flex justify-center items-start">
                    <div className="w-full max-w-[600px] bg-white shadow-xl rounded-lg overflow-hidden min-h-[600px]">
                        <iframe 
                            srcDoc={editingTemplate?.htmlContent || '<div style="padding:20px;text-align:center;color:#888;">Start typing HTML to see preview...</div>'}
                            className="w-full h-full min-h-[600px] border-none"
                            title="Preview"
                            sandbox="allow-same-origin"
                        />
                    </div>
                </div>
            </div>
        </div>
      </form>
    );
  }

  // --- RENDER: List View ---
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h1 className="text-2xl font-bold tracking-tight">Email Templates</h1>
            <p className="text-slate-500 text-sm">Manage system emails and notifications.</p>
        </div>
        <Button onClick={() => handleEdit(null)} className="bg-slate-900">
            <Plus className="mr-2 h-4 w-4" /> New Template
        </Button>
      </div>

      <div className="border rounded-md bg-white">
        <Table>
            <TableHeader>
                <TableRow className="bg-slate-50">
                    <TableHead>Key Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {loading ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center"><Loader2 className="animate-spin mx-auto text-slate-400" /></TableCell>
                    </TableRow>
                ) : templates.length === 0 ? (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center text-slate-500">No templates found.</TableCell>
                    </TableRow>
                ) : (
                    templates.map(t => (
                        <TableRow key={t._id}>
                            <TableCell className="font-mono text-xs font-bold text-slate-700">{t.name}</TableCell>
                            <TableCell>{t.subject}</TableCell>
                            <TableCell className="text-slate-500 text-sm truncate max-w-[200px]">{t.description}</TableCell>
                            <TableCell className="text-right space-x-1">
                                <Button variant="ghost" size="icon" onClick={() => handleEdit(t)}>
                                    <Pencil className="h-4 w-4 text-blue-600" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => handleDelete(t._id)}>
                                    <Trash2 className="h-4 w-4 text-red-500" />
                                </Button>
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