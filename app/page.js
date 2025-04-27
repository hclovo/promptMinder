"use client"; // 必须是客户端组件才能使用 hooks
import Link from "next/link";
// import { Metadata } from "next"; // 移除静态 Metadata 导入
import { Header } from "@/components/landing/header";
import Footer from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureSection } from "@/components/landing/feature-section";
// import { PricingSection } from "@/components/landing/pricing-section"; // 保持注释
import { TestimonialSection } from "@/components/landing/testimonial-section";
import { FAQSection } from "@/components/landing/faq-section";
import { CTASection } from "@/components/landing/cta-section";
// 移除 useState, useEffect 和翻译文件导入
// import { useState, useEffect } from 'react';
// import en from '@/messages/en.json';
// import zh from '@/messages/zh.json';
// 导入 useLanguage hook
import { useLanguage } from '@/contexts/LanguageContext';

// 移除本地 translations 对象
// const translations = { en, zh };

export default function Home() {
  // 使用 Context 获取翻译对象 t
  const { t } = useLanguage();

  // 移除本地状态和 effects
  // const [language, setLanguage] = useState('zh');
  // const t = translations[language];
  // useEffect(() => { ... }, [language]);

  // Context 加载保护
  if (!t) return null; 

  return (
    <>
      {/* Header 现在从 Context 获取状态，无需 props */}
      <Header /> 
      <main className="flex min-h-screen flex-col pt-16">
        {/* 将 Context 中的 t 传递给子组件 */}
        <HeroSection t={t.hero} />
        <FeatureSection t={t.features} />
        {/* <PricingSection /> */}
        <TestimonialSection t={t.testimonials} />
        <FAQSection t={t.faq} />
        <CTASection t={t.cta} />
      </main>
      {/* 将 Context 中的 t 传递给 Footer */}
      <Footer t={t.footer} />
    </>
  );
}
