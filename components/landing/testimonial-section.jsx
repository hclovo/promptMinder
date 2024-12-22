"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    content: "这是一个非常简单的方式来迭代和管理提示词。",
    author: "IndieAI",
    title: "AI 独立开发者",
    avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=123`,
  },
  {
    content: "Prompt Minder 真的很棒，简洁但不简单。",
    author: "小锐",
    title: "提示词工程师",
    avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=456`,
  },
  {
    content: "Prompt Minder 创建了一个很好的调试环境。",
    author: "aircrushin",
    title: "AI 爱好者",
    avatar: `https://api.dicebear.com/7.x/fun-emoji/svg?seed=789`,
  },
];

export function TestimonialSection() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-16">
          深受千万用户喜爱
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_0_rgba(0,0,0,0.1)] hover:shadow-[0_2px_4px_0_rgba(0,0,0,0.1)] transition-shadow"
            >
              <div className="min-h-[160px] flex flex-col">
                <p className="text-gray-600 text-lg italic mb-8">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
                <div className="mt-auto flex items-center gap-3">
                  <Image
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
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