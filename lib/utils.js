import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// 安全的日期格式化函数
export function formatDate(dateValue, options = {}) {
  if (!dateValue) {
    return '-';
  }
  
  const date = new Date(dateValue);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '-';
  }
  
  try {
    if (options.includeTime) {
      return date.toLocaleString();
    }
    return date.toLocaleDateString();
  } catch (error) {
    console.error('Date formatting error:', error);
    return '-';
  }
}

// 安全的时间格式化函数
export function formatTime(dateValue, options = { hour: '2-digit', minute: '2-digit' }) {
  if (!dateValue) {
    return '-';
  }
  
  const date = new Date(dateValue);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return '-';
  }
  
  try {
    return date.toLocaleTimeString([], options);
  } catch (error) {
    console.error('Time formatting error:', error);
    return '-';
  }
}
