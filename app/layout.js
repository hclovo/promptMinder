"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/app/components/layout/Navbar";
import { usePathname } from "next/navigation";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          unsafe_disableDevelopmentModeWarnings: true,
        },
      }}
    >
      <html lang="en">
        <body className={inter.className}>
          <NavbarWrapper />
          {children}
          <Toaster position="top-center" />
        </body>
      </html>
    </ClerkProvider>
  );
}

function NavbarWrapper() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const isSignInPage = pathname === "/sign-in";
  const isSignUpPage = pathname === "/sign-up";

  if (isHomePage || isSignInPage || isSignUpPage) {
    return null;
  }

  return <Navbar />;
}
