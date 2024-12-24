"use client";

import { motion } from "framer-motion";

const features = [
  {
    title: "智能分类管理",
    description: "通过标签、项目等多种方式组织提示词，快速检索所需内容",
    icon: "🗂️",
  },
  {
    title: "版本控制",
    description: "记录每次修改历史，随时回溯查看或还原之前的版本",
    icon: "🔄",
  },
  {
    title: "团队协作",
    description: "支持多人协作，细粒度的权限控制，实时同步更新",
    icon: "👥",
  },
  {
    title: "AI模型支持",
    description: "支持任何兼容 OpenAI 接口模型，提供实时测试环境",
    icon: "🤖",
  },
  {
    title: "数据安全",
    description: "企业级数据加密，可选择私有部署方案",
    icon: "🔒",
  },
  {
    title: "提示词优化",
    description: "提供提示词优化服务，一键生成高质量提示词",
    icon: "🔌",
  },
];

export function FeatureSection() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            强大而简单的功能
          </h2>
          <p className="text-gray-600">
            为您提供一站式的提示词管理解决方案
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 