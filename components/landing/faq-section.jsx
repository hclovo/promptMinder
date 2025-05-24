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
    <section className="py-24 bg-white">
      <div className="container mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6">
            {/* 使用翻译 */}
            {translations.title}
          </h2>
          <p className="text-lg text-gray-700 max-w-3xl mx-auto">
            {/* 使用翻译 */}
            {translations.description}
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* 使用翻译后的 faqs 列表 */}
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              className="mb-4"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {/* 使用翻译 */}
                    {faq.question}
                  </h3>
                  <span className="text-gray-600 text-xl">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </div>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: '1rem' }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <p className="text-gray-700 leading-relaxed">
                      {/* 使用翻译 */}
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 