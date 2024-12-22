"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { TypeAnimation } from 'react-type-animation';

export function HeroSection() {
  const { isSignedIn } = useAuth();

  return (
    <section className="relative overflow-hidden bg-white pt-20 pb-20">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px]">
        <div className="absolute inset-0 bg-gradient-radial from-blue-100 via-purple-50 to-transparent blur-[100px] opacity-50" />
      </div>

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            让AI提示词管理更简单
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            专业的提示词管理平台，为
            <TypeAnimation
              sequence={[
                'AI从业者',
                3000,
                '内容创作者',
                3000,
              ]}
              wrapper="span"
              speed={50}
              className="text-blue-600 font-medium"
              repeat={Infinity}
            />
            打造
          </p>
          <p className="text-sm md:text-base text-gray-600 mb-8">
            支持版本控制、团队协作、智能分类等功能
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={isSignedIn ? "/prompts" : "/sign-up"}
              className="px-8 py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
            >
              免费开始使用
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              查看价格方案
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
} 