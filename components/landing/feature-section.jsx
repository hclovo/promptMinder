"use client";

import { motion } from "framer-motion";
import { FolderOpenIcon, ArrowPathIcon, UsersIcon, CpuChipIcon, LockClosedIcon, LightBulbIcon } from '@heroicons/react/24/outline';

// Base data for features, including icon components and default English text.
const baseFeatureData = [
  {
    defaultTitle: "Smart Category Management",
    defaultDescription: "Organize prompts efficiently with intuitive categories and tags for quick access.",
    IconComponent: FolderOpenIcon
  },
  {
    defaultTitle: "Version Control",
    defaultDescription: "Track every change. Revert to previous prompt versions easily with a single click.", // Corrected typo
    IconComponent: ArrowPathIcon
  },
  {
    defaultTitle: "Team Collaboration",
    defaultDescription: "Share, discuss, and refine prompts with your team in a centralized workspace.",
    IconComponent: UsersIcon
  },
  {
    defaultTitle: "AI Model Support",
    defaultDescription: "Seamlessly integrate with various AI models. Use your prompts where you need them.",
    IconComponent: CpuChipIcon
  },
  {
    defaultTitle: "Data Security",
    defaultDescription: "Enterprise-level data encryption ensures your prompts and sensitive data are always protected.",
    IconComponent: LockClosedIcon
  },
  {
    defaultTitle: "Prompt Optimization",
    defaultDescription: "Leverage built-in tools and suggestions to enhance the effectiveness of your prompts.",
    IconComponent: LightBulbIcon
  },
];

export function FeatureSection({ t }) { // t is expected to be context_t.features from app/page.js
  // Use translated section title and description if available, otherwise use defaults.
  const sectionTitle = (t && t.title) || 'Powerful and Simple Features';
  const sectionDescription = (t && t.description) || 'Providing you with a one-stop prompt management solution';

  // `t.items` would be the array of translated {title, description} objects from JSON files.
  const translatedItems = (t && Array.isArray(t.items)) ? t.items : [];

  // Map over baseFeatureData to ensure icons are always correct, and merge with translations.
  const featuresToRender = baseFeatureData.map((baseFeature, index) => {
    const translatedItem = translatedItems[index] || {}; // Get corresponding translated text object safely.
    return {
      title: translatedItem.title || baseFeature.defaultTitle,
      description: translatedItem.description || baseFeature.defaultDescription,
      Icon: baseFeature.IconComponent // Always use the component from baseFeatureData.
    };
  });

  return (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50"> {/* Subtle gradient background */}
      <div className="container mx-auto px-8">
        <div className="text-center mb-20"> {/* Increased margin */}
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6"> {/* Bolder title */}
            {sectionTitle}
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto"> {/* Improved description text */}
            {sectionDescription}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"> {/* Increased gap */}
          {featuresToRender.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }} // Smoother animation
              className="group p-8 rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1 flex flex-col items-center text-center" // Enhanced card styling with flex for centering
            >
              <feature.Icon className="h-12 w-12 text-blue-600 mb-6 group-hover:text-indigo-600 transition-colors duration-300" /> {/* Styled icon using feature.Icon */}
              <h3 className="text-2xl font-semibold text-gray-900 mb-4"> {/* Larger feature title */}
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">  {/* Improved paragraph styling */}
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
} 