'use client';

import { useState, useEffect } from 'react';
import { PromptCard } from '@/components/prompt/PromptCard';
import { useLanguage } from '@/contexts/LanguageContext';

export default function PublicPromptsClient() {
    const { language, t } = useLanguage();
    const [prompts, setPrompts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const response = await fetch(`/api/prompts/public?lang=${language}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to fetch prompts: ${response.status}`);
                }
                
                const data = await response.json();
                setPrompts(data.prompts || []);
            } catch (err) {
                console.error('Error fetching prompts:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchPrompts();
    }, [language]); // 当语言改变时重新获取数据
    
    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">
                        {t && t.publicPage ? t.publicPage.loading || 'Loading...' : 'Loading...'}
                    </p>
                </div>
            </div>
        );
    }
    
    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-4">⚠️</div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t && t.publicPage ? t.publicPage.error || 'Error loading prompts' : 'Error loading prompts'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">{error}</p>
                    <button 
                        onClick={() => window.location.reload()} 
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        {t && t.publicPage ? t.publicPage.retry || 'Retry' : 'Retry'}
                    </button>
                </div>
            </div>
        );
    }
    
    // Handle case where translations are not loaded yet
    if (!t || !t.publicPage) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-gray-950 dark:via-gray-900 dark:to-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
                </div>
            </div>
        );
    }

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
                                {t.publicPage.title}
                            </h1>
                            <div className="h-1 w-24 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full" />
                        </div>
                        
                        <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-light">
                            {t.publicPage.subtitle}
                        </p>
                        
                        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent w-12" />
                            <span className="px-4 bg-white/80 dark:bg-gray-900/80 rounded-full py-1">
                                {t.publicPage.totalPrompts.replace('{count}', prompts.length)}
                            </span>
                            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent w-12" />
                        </div>
                    </div>

                    {/* Masonry/Waterfall layout - 小红书风格 */}
                    <div className="masonry-container columns-1 sm:columns-2 lg:columns-3 xl:columns-4 2xl:columns-5 gap-6">
                        {prompts.map((p, i) => (
                            <div
                                key={`${language}-${i}`} // 添加语言前缀确保key唯一性
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