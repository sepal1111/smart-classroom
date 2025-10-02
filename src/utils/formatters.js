// File: /src/utils/formatters.js

// 這裡是放置共用工具函數的地方，特別是與格式化相關的。

/**
 * 將 Date 物件格式化為 YYYY-MM-DD
 * @param {Date} date - 日期物件
 * @returns {string} 格式化後的日期字串
 */
export function formatDate(date) {
  if (!date) return '';
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
