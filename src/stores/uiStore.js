// File: /src/stores/uiStore.js

import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useUiStore = defineStore('ui', () => {
  // state
  const isLoading = ref(false);
  const isModalOpen = ref(false);
  const modalContent = ref(null);

  // actions
  function startLoading() {
    isLoading.value = true;
  }

  function stopLoading() {
    isLoading.value = false;
  }

  function openModal(content) {
    modalContent.value = content;
    isModalOpen.value = true;
  }
  
  function closeModal() {
    isModalOpen.value = false;
    modalContent.value = null;
  }

  return {
    isLoading,
    isModalOpen,
    startLoading,
    stopLoading,
    openModal,
    closeModal,
  };
});
