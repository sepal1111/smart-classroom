<!-- File: /src/components/shared/BaseModal.vue -->
<template>
  <div class="modal-backdrop">
    <div class="modal-content">
      <header>
        <slot name="header">
          <h2>預設標題</h2>
        </slot>
      </header>
      <main>
        <slot></slot>
      </main>
      <footer>
        <slot name="footer">
          <button @click="$emit('close')">關閉</button>
        </slot>
      </footer>
    </div>
  </div>
</template>

<script setup>
// 這裡是元件的 JavaScript 邏輯
defineEmits(['close']);
</script>

<style scoped>
/* 這裡是此元件專屬的 CSS 樣式 */
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  min-width: 300px;
}
</style>
