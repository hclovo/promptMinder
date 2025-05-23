"use client";

import { motion } from "framer-motion";
import { useState } from "react";

// 接收 t prop
export function FAQSection({ t }) {
  const [openIndex, setOpenIndex] = useState(null);
  // 如果 t 不存在，提供一个默认值
  const translations = t || {
    title: 'Frequently Asked Questions',
    description: 'Learn more about Prompt Minder',
    items: [
      { question: "How to start using Prompt Minder?", answer: "Simply register..." },
      { question: "Does it support team collaboration?", answer: "Yes, we offer..." },
      { question: "How is data security ensured?", answer: "We use enterprise-level..." },
      { question: "Is private deployment supported?", answer: "Enterprise plan users..." },
    ]
  };
  // 使用翻译后的 faqs 列表
  const faqs = translations.items;

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {/* 使用翻译 */}
            {translations.title}
          </h2>
          <p className="text-gray-600 text-lg">
            {/* 使用翻译 */}
            {translations.description}
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* 使用翻译后的 faqs 列表 */}
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mb-4"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {/* 使用翻译 */}
                    {faq.question}
                  </h3>
                  <span className="text-gray-500">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </div>
                {openIndex === index && (
                  <p className="mt-4 text-gray-600">
                    {/* 使用翻译 */}
                    {faq.answer}
                  </p>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 