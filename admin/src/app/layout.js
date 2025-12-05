import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: "Mind Namo Admin", description: "Admin Dashboard" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}