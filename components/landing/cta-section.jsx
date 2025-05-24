"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export function CTASection({ t }) {
  const { isSignedIn } = useAuth();
  
  const translations = t || {
    title: 'Ready to get started?',
    description: 'Join Prompt Minder now and start your AI prompt management journey',
    buttonLoggedIn: 'Go to Console',
    buttonLoggedOut: 'Sign Up for Free'
  };
  
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[600px] h-[400px] opacity-30">
        <div className="absolute inset-0 bg-gradient-radial from-purple-100 via-blue-50 to-transparent blur-[80px]" />
      </div>
      <div className="absolute bottom-0 right-1/4 translate-x-1/2 w-[500px] h-[300px] opacity-20">
        <div className="absolute inset-0 bg-gradient-radial from-indigo-100 via-pink-50 to-transparent blur-[70px]" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 [-webkit-background-clip:text] [background-clip:text] text-transparent bg-gradient-to-r from-gray-800 via-slate-600 to-slate-500 leading-tight">
            {translations.title}
          </h2>
          <p className="text-lg md:text-xl text-gray-700 mb-10">
            {translations.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={isSignedIn ? "/prompts" : "/sign-up"}
              className="inline-flex items-center justify-center px-10 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              {isSignedIn ? translations.buttonLoggedIn : translations.buttonLoggedOut}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}