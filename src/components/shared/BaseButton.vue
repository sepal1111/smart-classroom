<!-- File: /src/components/shared/BaseButton.vue -->
<template>
  <button class="base-button">
    <slot></slot>
  </button>
</template>

<script setup>
// 這裡是元件的 JavaScript 邏輯
// 可以透過 defineProps 接收父元件傳來的屬性
</script>

<style scoped>
/* 這裡是此元件專屬的 CSS 樣式 */
.base-button {
  padding: 0.5rem 1rem;
  border: none;
  background-color: #42b983;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.base-button:hover {
  background-color: #36a374;
}
</style>
