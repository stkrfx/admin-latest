"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession, signOut } from "next-auth/react"
import { LogOut, Settings, Brain } from "lucide-react"
import Link from "next/link"

export default function DashboardLayout({ children }) {
  const { data: session } = useSession()

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden flex flex-col bg-white/50">
        
        {/* Sticky Header */}
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b bg-white/80 px-4 backdrop-blur-md transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-16 sticky top-0 z-20">
          
          {/* LEFT: Trigger + Mobile Logo */}
          <div className="flex items-center gap-3">
            <SidebarTrigger className="-ml-1 h-9 w-9 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg" />
            
            {/* Mobile Only: Logo & Text */}
            <div className="flex items-center gap-2 md:hidden">
              <div className="flex items-center gap-2">
                 <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
                    <Brain className="size-4" />
                 </div>
                 <span className="font-bold text-slate-900 text-sm tracking-tight">Mind Namo</span>
              </div>
            </div>
          </div>

          {/* RIGHT: Mobile Only Profile Dropdown */}
          <div className="flex items-center md:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 cursor-pointer border border-slate-200">
                  <AvatarImage src={session?.user?.image} alt={session?.user?.name} />
                  <AvatarFallback className="bg-slate-900 text-white font-medium text-xs">
                    {session?.user?.name?.[0] || 'A'}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 rounded-xl shadow-lg border-slate-100 mt-1">
                <DropdownMenuLabel className="font-normal p-3 bg-slate-50/50 border-b border-slate-100 mb-1">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-semibold leading-none">{session?.user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <div className="p-1">
                    <DropdownMenuItem asChild>
                        <Link href="/dashboard/settings" className="cursor-pointer flex items-center gap-2 rounded-md px-2 py-2">
                            <Settings className="size-4 text-slate-500" />
                            <span>Settings</span>
                        </Link>
                    </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator className="my-1 bg-slate-100" />
                <div className="p-1">
                    <DropdownMenuItem onClick={() => signOut()} className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer flex items-center gap-2 rounded-md px-2 py-2">
                        <LogOut className="size-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 w-full max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
          {children}
        </main>

      </SidebarInset>
    </SidebarProvider>
  )
}