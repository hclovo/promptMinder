import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-8 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-gray-500">
            © {new Date().getFullYear()} PromptMinder. All rights reserved
          </div>
          <div className="flex gap-6 mt-4 sm:mt-0">
            <Link href="https://code.promptate.xyz/" target="_blank" className="text-sm text-gray-500 hover:text-gray-900">
              PromptCoder
            </Link>
            <Link href="https://www.promptingguide.ai/zh" target="_blank" className="text-sm text-gray-500 hover:text-gray-900">
              PromptGuide
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
} 