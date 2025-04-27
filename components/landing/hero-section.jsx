"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { TypeAnimation } from 'react-type-animation';

export function HeroSection({ t }) {
  const { isSignedIn } = useAuth();
  const translations = t || { 
    mainTitle: 'Make AI Prompt Management Simpler',
    subtitleStart: 'An open-source prompt management platform built for ',
    animatedText: ['AI practitioners', 'content creators'],
    subtitleEnd: '',
    description: 'Supports version control, team collaboration, smart categorization, and more.',
    ctaButton: 'Start Using for Free'
  };

  return (
    <section className="relative overflow-hidden bg-white pt-24 pb-24">
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6 [-webkit-background-clip:text] [background-clip:text] text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            {translations.mainTitle}
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-2">
            {translations.subtitleStart}
            <TypeAnimation
              sequence={translations.animatedText.flatMap(item => [item, 3000])}
              wrapper="span"
              speed={50}
              className="text-blue-600 font-medium"
              repeat={Infinity}
            />
            {translations.subtitleEnd}
          </p>
          <p className="text-sm md:text-base text-gray-600 mb-8">
            {translations.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={isSignedIn ? "/prompts" : "/sign-up"}
              className="px-8 py-4 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-all"
            >
              {translations.ctaButton}
            </Link>
            {/* <Link
              href="/pricing"
              className="px-8 py-4 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-all"
            >
              查看价格方案
            </Link> */}
          </div>
        </motion.div>
      </div>
    </section>
  );
} 