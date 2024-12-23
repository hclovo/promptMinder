"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';
import { Menu, FolderPlus, Library, LogOut } from "lucide-react"
import Image from "next/image";
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
  } from "@/components/ui/navigation-menu"

export function Header() {
  const pathname = usePathname();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <Image src="/logo2.png" alt="PromptMinder" width={60} height={60} />
            <span className="text-xl font-bold [-webkit-background-clip:text] [background-clip:text] text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              PromptMinder
            </span>
          </Link>

          {/* Navigation & Auth */}
          <div className="flex items-center gap-8">
            {/* Center Navigation */}
            <SignedIn>
              <NavigationMenu className="hidden sm:flex">
                <NavigationMenuList className="space-x-8">
                  <NavigationMenuItem>
                    <Link href="/prompts" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={`${
                          pathname === '/prompts'
                            ? 'text-primary font-medium'
                            : 'text-muted-foreground'
                        } flex items-center gap-1`}
                      >
                        <Library className="h-4 w-4" />
                        管理
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                  
                  <NavigationMenuItem>
                    <Link href="/prompts/new" legacyBehavior passHref>
                      <NavigationMenuLink
                        className={`${
                          pathname === '/prompts/new'
                            ? 'text-primary font-medium'
                            : 'text-muted-foreground'
                        } flex items-center gap-1`}
                      >
                        <FolderPlus className="h-4 w-4" />
                        新建
                      </NavigationMenuLink>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </SignedIn>

            {/* Right aligned auth buttons */}
            <div className="flex items-center space-x-3">
              <SignedOut>
                <Link href="/prompts">
                  <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
                    登录
                  </button>
                </Link>
                <Link href="/prompts">
                  <button className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors">
                    注册
                  </button>
                </Link>
              </SignedOut>
              <SignedIn>
                <UserButton afterSignOutUrl="/" />
              </SignedIn>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
