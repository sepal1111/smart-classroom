<!-- File: /src/App.vue -->
<template>
    <div id="app-container">
      <!-- 只有在登入後才顯示導覽列與側邊欄 -->
      <TheNavbar v-if="authStore.isLoggedIn" />
      <div class="main-layout">
        <TheSidebar v-if="authStore.isLoggedIn" />
        <main class="content">
          <router-view />
        </main>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import { getAuth, onAuthStateChanged } from 'firebase/auth';
  import { useAuthStore } from './stores/authStore';
  import TheNavbar from './components/layout/TheNavbar.vue';
  import TheSidebar from './components/layout/TheSidebar.vue';
  
  const authStore = useAuthStore();
  
  // onMounted 是一個生命週期鉤子，會在元件掛載到畫面上後執行
  // 這是設定監聽器的絕佳位置
  onMounted(() => {
    const auth = getAuth();
    
    // onAuthStateChanged 會持續監聽 Firebase 的認證狀態變化
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // 如果 user 物件存在，表示使用者已登入
        // 我們用使用者資訊來更新 Pinia store
        authStore.setUser({
          uid: user.uid,
          email: user.email,
        });
      } else {
        // 如果 user 物件為 null，表示使用者已登出或未登入
        // 我們清除 Pinia store 中的使用者資料
        authStore.clearUser();
      }
    });
  });
  </script>
  
  <style>
  /* 這裡是全域樣式，會影響所有元件 */
  body {
    margin: 0;
    font-family: 'Helvetica Neue', Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  
  #app-container {
    display: flex;
    flex-direction: column;
    height: 100vh; /* 佔滿整個視窗高度 */
  }
  
  .main-layout {
    display: flex;
    flex: 1; /* 佔滿除了 Navbar 以外的剩餘空間 */
    overflow: hidden; /* 避免外層佈局產生捲軸 */
  }
  
  .content {
    flex: 1;
    padding: 2rem;
    overflow-y: auto; /* 讓主要內容區域可以滾動 */
    background-color: #f4f7f9;
  }
  </style>
  
  