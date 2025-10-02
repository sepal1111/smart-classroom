<!-- File: /src/views/DashboardView.vue -->
<template>
    <div class="dashboard">
      <h1 class="welcome-title">歡迎回來，{{ authStore.user?.email }}！</h1>
      <p class="welcome-subtitle">您可以從這裡快速開始管理您的班級事務。</p>
  
      <div class="shortcut-grid">
        <!-- 學生管理捷徑 -->
        <router-link to="/students" class="shortcut-card">
          <div class="card-icon">👤</div>
          <h2 class="card-title">學生管理</h2>
          <p class="card-description">管理班級學生名單、照片與基本資料。</p>
        </router-link>
  
        <!-- 座位表捷徑 -->
        <router-link to="/seating-chart" class="shortcut-card">
          <div class="card-icon">🪑</div>
          <h2 class="card-title">座位表</h2>
          <p class="card-description">視覺化編輯與管理學生座位表。</p>
        </router-link>
        
        <!-- 出缺席紀錄捷徑 -->
        <router-link to="/attendance" class="shortcut-card">
          <div class="card-icon">📋</div>
          <h2 class="card-title">出缺席紀錄</h2>
          <p class="card-description">快速記錄學生的出缺席狀況。</p>
        </router-link>
        
        <!-- 其他功能預留位置 -->
        <router-link to="/grades" class="shortcut-card disabled">
          <div class="card-icon">🏆</div>
          <h2 class="card-title">成績紀錄</h2>
          <p class="card-description">記錄並追蹤學生的各項成績表現。</p>
        </router-link>
      </div>
    </div>
  </template>
  
  <script setup>
  import { useAuthStore } from '../../stores/authStore';
  
  const authStore = useAuthStore();
  </script>
  
  <style scoped>
  /* 這裡是此元件專屬的 CSS 樣式 */
  .dashboard {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .welcome-title {
    font-size: 2.5rem;
    font-weight: 300;
    color: #333;
    margin-bottom: 0.5rem;
  }
  
  .welcome-subtitle {
    font-size: 1.1rem;
    color: #777;
    margin-bottom: 3rem;
  }
  
  .shortcut-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 2rem;
  }
  
  .shortcut-card {
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    text-decoration: none;
    color: inherit;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
    display: flex;
    flex-direction: column;
    border: 1px solid #e0e0e0;
  }
  
  .shortcut-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0,0,0,0.08);
  }
  
  .card-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }
  
  .card-title {
    font-size: 1.4rem;
    margin-bottom: 0.5rem;
    color: #2c3e50;
  }
  
  .card-description {
    font-size: 0.95rem;
    color: #555;
    line-height: 1.5;
    flex-grow: 1; /* 讓描述區塊撐開，使卡片等高 */
  }
  
  .shortcut-card.disabled {
    background-color: #f8f9fa;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .shortcut-card.disabled:hover {
      transform: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  }
  </style>
  
  