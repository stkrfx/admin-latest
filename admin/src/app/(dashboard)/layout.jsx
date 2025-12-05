'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, FileText, Settings, LogOut, MessageSquare, Shield } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: '/', label: 'Overview', icon: LayoutDashboard },
  { href: '/users', label: 'User Management', icon: Users },
  { href: '/admins', label: 'Admin Roles', icon: Shield },
  { href: '/email-templates', label: 'Email Templates', icon: FileText },
  { href: '/faqs', label: 'FAQs', icon: MessageSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
];

export default function DashboardLayout({ children }) {
  const pathname = usePathname();

  return (
    <div className="flex h-[100dvh] bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-100">
          <span className="font-bold text-xl text-slate-900">Mind Namo</span>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              pathname === item.href ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
            )}>
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <Button variant="ghost" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => signOut()}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-10">
          <h1 className="font-semibold text-slate-800 capitalize">{pathname.split('/').pop().replace('-', ' ')}</h1>
          <div className="h-8 w-8 bg-slate-900 rounded-full flex items-center justify-center text-white text-xs font-bold">A</div>
        </header>
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}