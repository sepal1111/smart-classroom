// File: /src/composables/useAuth.js

import { ref } from 'vue';
// 這裡將會引入 Firebase Auth 相關服務

// 這是一個 Composition API 函數
// 用於管理使用者的登入狀態、資料等

export default function useAuth() {
  const user = ref(null);
  const isLoggedIn = ref(false);

  // 登入、登出、註冊等函數將會定義在這裡

  return {
    user,
    isLoggedIn,
  };
}
