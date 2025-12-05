'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { getFAQs, saveFAQ, deleteFAQ } from "@/actions/faqs";
import { toast } from "sonner";

export default function FAQsPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadFAQs = async () => {
    const data = await getFAQs();
    setFaqs(data);
    setLoading(false);
  };

  useEffect(() => { loadFAQs(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = {
      id: editing?._id,
      question: formData.get("question"),
      answer: formData.get("answer"),
      order: Number(formData.get("order")),
    };
    
    await saveFAQ(data);
    toast.success("FAQ Saved");
    setIsOpen(false);
    loadFAQs();
  };

  const handleDelete = async (id) => {
    if(!confirm("Delete this FAQ?")) return;
    await deleteFAQ(id);
    toast.success("FAQ Deleted");
    loadFAQs();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
        <Button onClick={() => { setEditing(null); setIsOpen(true); }} className="bg-slate-900">
          <Plus className="mr-2 h-4 w-4" /> Add FAQ
        </Button>
      </div>

      {loading ? (
        <Loader2 className="animate-spin mx-auto" />
      ) : (
        <div className="grid gap-4">
          {faqs.map((faq) => (
            <Card key={faq._id} className="border-slate-200">
              <CardContent className="p-6 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{faq.question}</h3>
                  <p className="text-slate-600 mt-2">{faq.answer}</p>
                  <span className="text-xs text-slate-400 mt-2 block">Order: {faq.order}</span>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => { setEditing(faq); setIsOpen(true); }}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => handleDelete(faq._id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? "Edit FAQ" : "New FAQ"}</DialogTitle></DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input name="question" placeholder="Question" defaultValue={editing?.question} required />
            <Textarea name="answer" placeholder="Answer" defaultValue={editing?.answer} required />
            <Input name="order" type="number" placeholder="Display Order" defaultValue={editing?.order || 0} />
            <Button type="submit" className="w-full bg-slate-900">Save FAQ</Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}