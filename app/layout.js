"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import { usePathname } from 'next/navigation';
import { Toaster } from "@/components/ui/toaster"
import { Analytics } from "@vercel/analytics/next"
import { LanguageProvider } from '@/contexts/LanguageContext';
import Navbar from "../components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

// Define structured data
const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "name": "Prompt Minder",
      "url": "https://prompt-minder.com",
      "logo": "https://prompt-minder.com/logo.png", // Confirm this is the correct logo URL
      "sameAs": [ // Add links to your social media profiles here
        // "https://twitter.com/yourprofile",
        // "https://linkedin.com/company/yourcompany"
      ]
    },
    {
      "@type": "WebSite",
      "name": "Prompt Minder",
      "url": "https://prompt-minder.com",
      "potentialAction": { // Optional: If you have a site search
        "@type": "SearchAction",
        "target": "https://prompt-minder.com/search?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ]
};

export default function RootLayout({ children }) {
  const pathname = usePathname();
  
  const noHeaderFooterPages = ['/'];
  const shouldShowHeaderFooter = !noHeaderFooterPages.includes(pathname);

  return (
    <LanguageProvider>
      <html>
        <head>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
          />
        </head>
        <body className={inter.className}>
          <div className="min-h-screen flex flex-col">
            {shouldShowHeaderFooter && <Navbar />}
            <main className="flex-1">
              {children}
            </main>
          </div>
          <Toaster />
          <Analytics />
        </body>
      </html>
    </LanguageProvider>
  );
}
