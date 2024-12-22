import Link from "next/link";
import { Metadata } from "next";
import { Header } from "@/components/landing/header";
import { HeroSection } from "@/components/landing/hero-section";
import { FeatureSection } from "@/components/landing/feature-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { TestimonialSection } from "@/components/landing/testimonial-section";
import { FAQSection } from "@/components/landing/faq-section";

export const metadata = {
  title: "Prompt Minder - 专业的AI提示词管理平台",
  description: "为AI从业者打造的提示词管理工具，支持版本控制、团队协作、智能分类等功能",
  keywords: ["AI提示词", "Prompt工程", "GPT", "Claude", "AI助手", "提示词管理"],
  openGraph: {
    title: "Prompt Minder - 专业的AI提示词管理平台",
    description: "为AI从业者打造的提示词管理工具，支持版本控制、团队协作、智能分类等功能",
    images: [{ url: "/og-image.png" }],
  },
};

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col pt-16">
        <HeroSection />
        <FeatureSection />
        {/* <PricingSection /> */}
        <TestimonialSection />
        <FAQSection />
      </main>
    </>
  );
}
