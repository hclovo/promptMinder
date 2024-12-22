"use client";

import { motion } from "framer-motion";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            准备好开始使用了吗？
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            立即加入 Prompt Minder，开启您的 AI 提示词管理之旅
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-black hover:bg-blue-700 transition-colors"
            >
              免费注册
            </Link>
            {/* <Link
              href="/prompts"
              className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              查看示例
            </Link> */}
          </div>
        </motion.div>
      </div>
    </section>
  );
}