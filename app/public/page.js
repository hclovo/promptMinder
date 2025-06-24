import fs from 'fs';
import path from 'path';
import { PromptCard } from '@/components/prompt/PromptCard';

const parsePromptsFromFile = (filePath) => {
    const markdownContent = fs.readFileSync(filePath, 'utf-8');
    const prompts = [];
    const sections = markdownContent.split('### ').slice(1);

    sections.forEach(section => {
        const lines = section.split('\n');
        const category = lines[0].trim();
        const promptsText = lines.slice(1).join('\n');
        
        const promptBlocks = promptsText.split('- **角色/类别**: ').slice(1);
        
        promptBlocks.forEach(block => {
            const blockLines = block.split('\n');
            const role = blockLines[0].trim();
            
            const prompt = blockLines.slice(1).join('\n').replace('**提示词**:', '').trim();
            
            if (role && prompt) {
                prompts.push({
                    category,
                    role,
                    prompt
                });
            }
        });
    });

    return prompts;
};

export default function PublicPromptsPage() {
    const filePath = path.join(process.cwd(), 'public', 'prompts.md');
    const prompts = parsePromptsFromFile(filePath);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950">
            {/* Background decoration */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-50/30 via-transparent to-purple-50/30 dark:from-blue-950/20 dark:to-purple-950/20 pointer-events-none" />
            
            <div className="relative">
                <div className="container mx-auto px-4 py-12 sm:py-16 lg:py-20">
                    {/* Enhanced header section */}
                    <div className="text-center mb-16 space-y-6">
                        <div className="space-y-4">
                            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent leading-tight">
                                提示词合集
                            </h1>
                            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
                        </div>
                        
                        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                            探索、复制并使用这些精选的提示词来激发您的创造力
                        </p>
                        
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent w-12" />
                            <span className="px-4 bg-white/80 dark:bg-gray-900/80 rounded-full py-1">
                                共 {prompts.length} 个提示词
                            </span>
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent w-12" />
                        </div>
                    </div>

                    {/* Masonry/Waterfall layout - 小红书风格 */}
                    <div className="masonry-container columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-6">
                        {prompts.map((p, i) => (
                            <div
                                key={i}
                                className="masonry-item animate-fade-in-up"
                                style={{
                                    animationDelay: `${Math.min(i * 50, 1000)}ms`
                                }}
                            >
                                <PromptCard prompt={p} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
