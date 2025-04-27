"use client";

import { motion } from "framer-motion";
import Image from "next/image";

// 移除硬编码的 testimonials 数组
// const testimonials = [ ... ];

// 接收 t prop
export function TestimonialSection({ t }) {
  // 如果 t 不存在，提供一个默认值
  const translations = t || {
    title: 'Loved by Millions of Users',
    items: [
      { content: "This is a very simple way...", author: "IndieAI", title: "AI Indie Developer" },
      { content: "Prompt Minder is really great...", author: "Xiao Rui", title: "Prompt Engineer" },
      { content: "Prompt Minder creates...", author: "aircrushin", title: "AI Enthusiast" },
    ]
  };
  // 使用翻译后的 testimonials 列表，保持 avatar 不变
  const testimonials = translations.items.map((item, index) => ({
    ...item,
    avatar: [
      `https://api.dicebear.com/7.x/bottts/svg?seed=123`,
      `https://api.dicebear.com/7.x/pixel-art/svg?seed=456`,
      `https://api.dicebear.com/7.x/fun-emoji/svg?seed=789`
    ][index]
  }));

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
           {/* 使用翻译 */}
          {translations.title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
           {/* 使用翻译后的 testimonials 列表 */}
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.1)] transition-shadow"
            >
              <div className="min-h-[160px] flex flex-col">
                <p className="text-gray-600 text-lg italic mb-4">
                   {/* 使用翻译 */}
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="mt-auto flex items-center gap-3">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author} // alt 文本通常不需要翻译，或者可以用作者名
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.author}</p> { /* 作者名保持不变 */}
                    <p className="text-sm text-gray-500"> 
                      {/* 使用翻译 */}
                      {testimonial.title}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 