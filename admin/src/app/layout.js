import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Providers from "@/components/Providers"; // Import this

const inter = Inter({ subsets: ["latin"] });

export const metadata = { title: "Mind Namo Admin", description: "Admin Dashboard" };

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light" style={{ colorScheme: 'light' }}>
      <body className={`${inter.className} bg-slate-50 text-slate-900`}>
        {/* Wrap children in Providers */}
        <Providers>
          {children}
        </Providers>
        <Toaster />
      </body>
    </html>
  );
}