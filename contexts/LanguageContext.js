'use client';

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

// 1. 创建 Context
const LanguageContext = createContext({
  language: 'zh', // 默认值
  toggleLanguage: () => {}, // 默认函数
});

// 翻译文件（在这里导入以便 Provider 知道有哪些语言）
import en from '@/messages/en.json';
import zh from '@/messages/zh.json';
const translations = { en, zh };

// 2. 创建 Provider 组件
export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('zh'); // 默认中文

  useEffect(() => {
    // 组件挂载时，尝试从 localStorage 读取语言设置
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage && translations[savedLanguage]) {
      setLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
    } else {
      // 如果 localStorage 没有或无效，则设置默认语言的 lang 属性
      document.documentElement.lang = 'zh';
    }
  }, []); // 空依赖数组，只在挂载时运行一次

  const toggleLanguage = useCallback(() => {
    setLanguage(prevLanguage => {
      const newLanguage = prevLanguage === 'en' ? 'zh' : 'en';
      // 保存到 localStorage
      localStorage.setItem('language', newLanguage);
      // 更新 HTML lang 属性
      document.documentElement.lang = newLanguage;
      return newLanguage;
    });
  }, []);

  // 将 language 和 toggleLanguage 提供给子组件
  const value = { language, toggleLanguage, translations };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

// 3. 创建一个自定义 Hook 以方便使用 (可选但推荐)
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  // 直接从 context 返回 t 对象，方便使用
  const t = context.translations[context.language];
  return { ...context, t };
}; 