'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Menu, FolderPlus, Library, Languages } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
// 已移除认证功能
import { useLanguage } from '@/contexts/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const { language, toggleLanguage, t } = useLanguage();



  if (!t) return null;

  return (
    <nav className="border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <Link href="/" className="flex items-center group">
            <Image src="/logo2.png" alt="PromptMinder" width={60} height={60} />
            <span className="hidden sm:block text-xl font-bold bg-gradient-to-r from-primary/90 to-primary [-webkit-background-clip:text] [background-clip:text] text-transparent hover:from-primary hover:to-primary/90 transition-all duration-300">
              PromptMinder
            </span>
          </Link>

          <div className="flex items-center">
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
                      {t.navbar.manage}
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
                      {t.navbar.new}
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

              </NavigationMenuList>
            </NavigationMenu>

            <div className="sm:hidden flex items-center ml-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] sm:hidden">
                  <div className="flex flex-col gap-4 mt-4">
                    <Link
                      href="/prompts"
                      className={`${
                        pathname === '/prompts'
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground'
                      } flex items-center gap-2`}
                    >
                      <Library className="h-4 w-4" />
                      {t.navbar.manage}
                    </Link>
                    <Link
                      href="/prompts/new"
                      className={`${
                        pathname === '/prompts/new'
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground'
                      } flex items-center gap-2`}
                    >
                      <FolderPlus className="h-4 w-4" />
                      {t.navbar.new}
                    </Link>
                    <Button variant="ghost" onClick={toggleLanguage} className="justify-start mt-4">
                      <Languages className="h-4 w-4 mr-2" /> 
                      {t.language.switchTo} ({t.language.current})
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            <div className="flex items-center ml-8 space-x-4">
              <Button variant="outline" size="icon" onClick={toggleLanguage} className="hidden sm:inline-flex">
                <Languages className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
} 