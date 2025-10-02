// File: /src/services/firebase.js

// 引入 Firebase 套件
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// 您的 Firebase 設定物件
// 警告：請勿將這些金鑰直接寫在程式碼中並上傳到公開倉庫。
// 建議使用環境變數 (Environment Variables) 來管理。
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 初始化 Firebase
const app = initializeApp(firebaseConfig);

// 匯出各個服務的實例
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
