"use client";

import dynamic from "next/dynamic";

const MotionDiv = dynamic(
  () => import("framer-motion").then((mod) => mod.motion.div),
  {
    loading: () => <div />,
    ssr: false,
  }
);
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";
import { TypeAnimation } from "react-type-animation";
import ShinyText from "../texts/ShinyText";
import { GitHubStars } from "../ui/github-stars";

export function HeroSection({ t }) {
  const { isSignedIn } = useAuth();
  const translations = t || {
    mainTitle: "Make AI Prompt Management Simpler",
    subtitleStart: "An open-source prompt management platform built for ",
    animatedText: [
      "AI practitioners",
      "content creators",
      "developers",
      "researchers",
    ],
    subtitleEnd: "",
    description:
      "Supports version control, team collaboration, smart categorization, and more. Streamline your workflow and unlock the full potential of your AI prompts.",
    ctaButton: "Get Started for Free",
  };

  return (
    <section className="relative overflow-hidden bg-white pt-28 pb-32">
      {/* 背景装饰 */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px]">
        <div className="absolute inset-0 bg-gradient-radial from-blue-100 via-purple-50 to-transparent blur-[100px] opacity-50" />
      </div>
      {/* New decorative element for "prompt" theme */}
      <div className="absolute top-1/4 left-1/4 w-16 h-16 md:w-24 md:h-24 opacity-30">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="text-blue-400"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7.5 8.25h9m-9 3H12m-6.75 3h9m-9 3H12m0-13.5c.621 0 1.125-.504 1.125-1.125V4.5A1.125 1.125 0 0012 3.375m-3.75 0A1.125 1.125 0 016.375 4.5v.75A1.125 1.125 0 015.25 6.375m3.75 0A1.125 1.125 0 0110.125 4.5v.75A1.125 1.125 0 019 6.375m3.75 0A1.125 1.125 0 0113.875 4.5v.75A1.125 1.125 0 0112.75 6.375m3.75 0A1.125 1.125 0 0117.625 4.5v.75A1.125 1.125 0 0116.5 6.375m-6.75 0h3.75"
          />
        </svg>
      </div>
      <div className="absolute bottom-1/4 right-1/4 w-12 h-12 md:w-20 md:h-20 opacity-20">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="text-purple-400 transform rotate-12"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774a1.125 1.125 0 01.12 1.45l-.527.737c-.25.35-.272.806-.108 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.11v1.093c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.142.854.108 1.204l.527.738a1.125 1.125 0 01-.12 1.45l-.773.773a1.125 1.125 0 01-1.45-.12l-.737-.527c-.35-.25-.806-.272-1.204-.108-.397.165-.71.505-.78.93l-.15.893c-.09.543-.56.94-1.11.94h-1.093c-.55 0-1.02-.397-1.11-.94l-.149-.893c-.07-.425-.383-.765-.78-.93-.398-.165-.854-.142-1.204.108l-.738.527a1.125 1.125 0 01-1.45-.12l-.773-.773a1.125 1.125 0 01-.12-1.45l.527-.738c.25-.35.272-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.11v-1.093c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.764-.383.93-.78.164-.398.142-.854-.108-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45.12l.737.527c.35.25.807.272 1.204.108.397-.165.71-.505.78-.93l.15-.893z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>

      <div className="relative container mx-auto px-4">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-5xl mx-auto" // Increased max-width for a wider feel
        >
          <h1 className="text-5xl md:text-7xl font-extrabold mb-8 leading-tight">
            <ShinyText
              text={translations.mainTitle}
              speed={4}
              className="text-transparent bg-gradient-to-r from-gray-900 via-slate-700 to-slate-600 [-webkit-background-clip:text] [background-clip:text]"
            />
          </h1>
          <div className="flex justify-center mb-6">
            <GitHubStars className="hover:scale-105 transition-transform duration-200" />
          </div>
          <p className="text-xl md:text-2xl text-gray-700 mb-4">
            {translations.subtitleStart}
            <TypeAnimation
              sequence={translations.animatedText.flatMap((item) => [
                item,
                2500,
              ])} // Slightly faster animation
              wrapper="span"
              speed={40} // Slightly faster typing
              className="text-blue-600 font-semibold" // Bolder animated text
              repeat={Infinity}
            />
            {translations.subtitleEnd}
          </p>
          <p className="text-md md:text-lg text-gray-600 mb-10 max-w-5xl mx-auto">
            {" "}
            {/* Slightly smaller, centered description */}
            {translations.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href={isSignedIn ? "/prompts" : "/sign-up"}
              className="px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105" // Enhanced button style
            >
              {translations.ctaButton}
            </Link>
          </div>
        </MotionDiv>
      </div>
    </section>
  );
}
