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
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
            {translations.title}
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {translations.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={isSignedIn ? "/prompts" : "/sign-up"}
              className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-black hover:bg-gray-800 transition-colors"
            >
              {isSignedIn ? translations.buttonLoggedIn : translations.buttonLoggedOut}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}