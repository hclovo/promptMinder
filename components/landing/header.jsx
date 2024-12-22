"use client";

import Link from "next/link";
import { SignInButton, SignUpButton } from "@clerk/nextjs";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
              PromptMinder
            </span>
          </Link>

          {/* Navigation & Auth */}
          <div className="flex items-center space-x-4">
            {/* <nav className="hidden md:flex items-center space-x-6 mr-4">
              <Link 
                href="/features" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                功能
              </Link>
              <Link 
                href="/pricing" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                价格
              </Link>
              <Link 
                href="/docs" 
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                文档
              </Link>
            </nav> */}

            <div className="flex items-center space-x-3">
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
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
