"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from '@clerk/nextjs';
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import { usePathname } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  // 定义不需要显示 header 和 footer 的页面路径
  const noHeaderFooterPages = ['/sign-in', '/sign-up','/','/'];
  const shouldShowHeaderFooter = !noHeaderFooterPages.includes(pathname);

  return (
    <ClerkProvider>
      <html lang="zh">
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col">
            {shouldShowHeaderFooter && <Navbar />}
            <main className="flex-1">
              {children}
            </main>
            {shouldShowHeaderFooter && <Footer />}
          </div>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
