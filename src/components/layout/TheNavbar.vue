<!-- File: /src/components/layout/TheNavbar.vue -->
<!-- 說明：這是頂部導覽列，已新增連結 Google 帳號的按鈕 -->
<template>
    <nav class="navbar">
      <div class="navbar-brand">
        <h3>智慧班級管理平台</h3>
      </div>
      <div class="navbar-menu">
        <div v-if="authStore.user" class="user-info">
          <span>{{ authStore.user.email }}</span>
          
          <!-- 如果使用者已登入，但尚未連結 Google 帳號，則顯示此按鈕 -->
          <BaseButton 
            v-if="authStore.isAuthenticated && !authStore.isGoogleLinked"
            @click="handleLinkGoogle"
            class="link-google-btn"
            small
          >
            連結 Google 帳號
          </BaseButton>
  
          <BaseButton @click="handleLogout" small class="logout-btn">登出</BaseButton>
        </div>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { useRouter } from 'vue-router';
  import { useAuthStore } from '../../stores/authStore';
  import { signInWithGoogle } from '../../services/authService';
  import BaseButton from '../shared/BaseButton.vue';
  
  const authStore = useAuthStore();
  const router = useRouter();
  
  const handleLogout = async () => {
    await authStore.logout();
    router.push('/login');
  };
  
  const handleLinkGoogle = async () => {
    try {
      const result = await signInWithGoogle();
      if (result) {
        alert('Google 帳號已成功連結！現在您可以使用需要 Google 授權的功能了。');
      }
    } catch (error) {
      console.error('連結 Google 帳號失敗:', error);
      alert('連結 Google 帳號時發生錯誤，請稍後再試。');
    }
  };
  </script>
  
  <style scoped>
  .navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 2rem;
    background-color: #ffffff;
    border-bottom: 1px solid #e0e0e0;
    height: 64px;
  }
  .navbar-brand h3 {
    margin: 0;
    font-weight: 600;
  }
  .navbar-menu {
    display: flex;
    align-items: center;
  }
  .user-info {
    display: flex;
    align-items: center;
    gap: 1rem;
    font-size: 0.9rem;
    color: #333;
  }
  .logout-btn {
    background-color: #f8f9fa;
    color: #3c4043;
    border: 1px solid #dadce0;
  }
  .logout-btn:hover {
    background-color: #f1f3f4;
  }
  .link-google-btn {
    background-color: #e8f0fe;
    color: #1967d2;
    border: 1px solid transparent;
  }
  .link-google-btn:hover {
    background-color: #d2e3fc;
  }
  </style>
  
  