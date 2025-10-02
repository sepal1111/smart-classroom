// File: /src/composables/useFirestore.js

import { ref } from 'vue';
// 這裡將會引入 Firestore 相關服務

// 這是一個 Composition API 函數
// 用於封裝對 Firestore 的資料操作，例如讀取學生列表

export default function useFirestore(collectionName) {
  const documents = ref([]);
  const error = ref(null);

  // 新增、讀取、更新、刪除等函數將會定義在這裡

  return {
    documents,
    error,
  };
}
