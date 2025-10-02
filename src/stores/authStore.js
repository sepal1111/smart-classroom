// File: /src/stores/authStore.js
// 說明：這個 Store 用於管理使用者的認證狀態。

import { defineStore } from 'pinia';
import { onAuthChanged, logOut } from '../services/authService';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    authProviders: [], // 用來存放使用者連結的認證方式, e.g., ['password', 'google.com']
    isAuthReady: false,
  }),
  getters: {
    isAuthenticated: (state) => !!state.user,
    isGoogleLinked: (state) => state.authProviders.includes('google.com'),
  },
  actions: {
    // 設定使用者資訊，並在 App.vue 中被 onAuthStateChanged 呼叫
    setUser(userData) {
      this.user = userData;
      if (userData) {
        // 從 user 物件中解析出 provider id
        this.authProviders = userData.providerData.map(provider => provider.providerId);
      } else {
        this.authProviders = [];
      }
    },
    
    // 初始化認證狀態監聽器
    init() {
      onAuthChanged((user) => {
        this.setUser(user);
        this.isAuthReady = true;
      });
    },

    // 登出
    async logout() {
      try {
        await logOut();
        this.user = null;
        this.authProviders = [];
      } catch (error) {
        console.error('登出失敗:', error);
      }
    },
  },
});

