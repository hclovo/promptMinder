"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const faqs = [
  {
    question: "如何开始使用 Prompt Minder？",
    answer: "只需要简单注册账号，即可开始使用。我们提供详细的使用教程和文档帮助您快速上手。",
  },
  {
    question: "是否支持团队协作？",
    answer: "是的，我们提供完整的团队协作功能，包括成员管理、权限控制、实时同步等特性。",
  },
  {
    question: "数据安全如何保障？",
    answer: "我们采用企业级加密技术保护您的数据，同时支持数据导出和备份功能。",
  },
  {
    question: "是否支持私有部署？",
    answer: "企业版用户可以选择私有部署方案，我们提供完整的部署支持和技术服务。",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            常见问题
          </h2>
          <p className="text-gray-600">
            了解更多关于 Prompt Minder 的信息
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="mb-4"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left p-6 rounded-lg bg-white border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-medium text-gray-900">
                    {faq.question}
                  </h3>
                  <span className="text-gray-500">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </div>
                {openIndex === index && (
                  <p className="mt-4 text-gray-600">{faq.answer}</p>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 