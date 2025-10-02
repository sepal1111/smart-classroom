<!-- File: /src/components/layout/TheSidebar.vue -->
<template>
    <aside class="sidebar">
      <nav class="navigation">
        <ul>
          <li>
            <router-link to="/dashboard" class="nav-link">
              <span class="icon">🏠</span>
              <span class="text">儀表板</span>
            </router-link>
          </li>
          <li>
            <router-link to="/students" class="nav-link">
              <span class="icon">👤</span>
              <span class="text">學生管理</span>
            </router-link>
          </li>
          <li>
            <router-link to="/seating-chart" class="nav-link">
              <span class="icon">🪑</span>
              <span class="text">座位表</span>
            </router-link>
          </li>
          <li>
            <router-link to="/attendance" class="nav-link">
              <span class="icon">📋</span>
              <span class="text">出缺席</span>
            </router-link>
          </li>
          <li>
            <router-link to="/grades" class="nav-link">
              <span class="icon">🏆</span>
              <span class="text">成績紀錄</span>
            </router-link>
          </li>
          <li>
            <router-link to="/assignments" class="nav-link">
              <span class="icon">📚</span>
              <span class="text">作品繳交</span>
            </router-link>
          </li>
           <li>
            <router-link to="/interactive" class="nav-link">
              <span class="icon">🏓</span>
              <span class="text">課堂互動</span>
            </router-link>
          </li>
        </ul>
      </nav>
    </aside>
  </template>
  
  <script setup>
  // 目前這個元件不需要額外的 JavaScript 邏輯
  </script>
  
  <style scoped>
  .sidebar {
    width: 240px;
    background-color: #ffffff;
    border-right: 1px solid #e0e0e0;
    padding: 1.5rem 0;
    display: flex;
    flex-direction: column;
  }
  
  .navigation ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  
  .nav-link {
    display: flex;
    align-items: center;
    padding: 0.9rem 1.5rem;
    text-decoration: none;
    color: #5a6e82;
    font-weight: 500;
    transition: background-color 0.2s ease, color 0.2s ease;
    margin: 0.25rem 0;
  }
  
  .nav-link:hover {
    background-color: #f4f7f9;
  }
  
  /* Vue Router 會自動為當前啟用的連結加上 .router-link-exact-active class */
  .nav-link.router-link-exact-active {
    background-color: #e8f0fe;
    color: #1967d2;
    border-right: 3px solid #1967d2;
  }
  
  .nav-link .icon {
    margin-right: 1rem;
    font-size: 1.2rem;
    width: 24px;
    text-align: center;
  }
  
  .nav-link .text {
    font-size: 1rem;
  }
  </style>
  
  