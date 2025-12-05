'use client';
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Eye, Code, Save } from "lucide-react";

export default function EmailTemplatesPage() {
  const [html, setHtml] = useState('<h1>Hello {{name}}</h1><p>Welcome to Mind Namo!</p>');
  const [mode, setMode] = useState('edit'); // edit | preview

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Email Templates</h2>
        <Button className="bg-slate-900"><Save className="mr-2 h-4 w-4" /> Save Template</Button>
      </div>
      
      <div className="flex gap-4 flex-1 overflow-hidden">
        {/* Editor Side */}
        <Card className="flex-1 flex flex-col border-slate-200">
          <div className="p-2 border-b flex justify-between bg-slate-50">
            <span className="text-sm font-medium flex items-center gap-2"><Code className="h-4 w-4" /> HTML Editor</span>
          </div>
          <Textarea 
            className="flex-1 resize-none border-0 focus-visible:ring-0 font-mono text-sm p-4" 
            value={html}
            onChange={(e) => setHtml(e.target.value)}
          />
        </Card>

        {/* Preview Side */}
        <Card className="flex-1 flex flex-col border-slate-200 bg-slate-100">
           <div className="p-2 border-b flex justify-between bg-white rounded-t-lg">
            <span className="text-sm font-medium flex items-center gap-2"><Eye className="h-4 w-4" /> Live Preview</span>
          </div>
          <div className="flex-1 p-8 overflow-auto flex justify-center">
            <div className="bg-white w-full max-w-[600px] h-full shadow-lg rounded-md overflow-hidden">
               <iframe 
                 srcDoc={html} 
                 className="w-full h-full border-none"
                 sandbox="allow-same-origin"
               />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}