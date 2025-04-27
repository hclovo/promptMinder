"use client";

import { motion } from "framer-motion";

// 接收 t prop
export function FeatureSection({ t }) {
  // 如果 t 不存在，提供一个默认值
  const translations = t || { 
    title: 'Powerful and Simple Features',
    description: 'Providing you with a one-stop prompt management solution',
    items: [
      { title: "Smart Category Management", description: "Organize prompts...", icon: "🗂️" },
      { title: "Version Control", description: "Record modification history...", icon: "🔄" },
      { title: "Team Collaboration", description: "Supports multi-person...", icon: "👥" },
      { title: "AI Model Support", description: "Supports any OpenAI compatible...", icon: "🤖" },
      { title: "Data Security", description: "Enterprise-level data encryption...", icon: "🔒" },
      { title: "Prompt Optimization", description: "Provides prompt optimization...", icon: "🔌" },
    ]
  };
  // 使用翻译后的 features 列表
  const features = translations.items.map((item, index) => ({ ...item, icon: ["🗂️", "🔄", "👥", "🤖", "🔒", "🔌"][index] })); // 保持 icon 不变

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {/* 使用翻译 */}
            {translations.title}
          </h2>
          <p className="text-gray-600">
            {/* 使用翻译 */}
            {translations.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 使用翻译后的 features 列表 */}
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="p-6 rounded-xl border border-gray-200 bg-white hover:shadow-lg transition-all"
            >
              <span className="text-3xl mb-4 block">{feature.icon}</span>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                 {/* 使用翻译 */}
                {feature.title}
              </h3>
              <p className="text-gray-600"> 
                {/* 使用翻译 */}
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 