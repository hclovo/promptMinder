'use client'

import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/app/components/layout/Navbar';
import { usePathname } from 'next/navigation';
import { ClerkProvider, SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {!isHomePage && <Navbar />}
          {children}
          <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}
