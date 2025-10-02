// File: /src/services/authService.js
// 說明：這個檔案專門處理所有與 Firebase Authentication 相關的操作。

import { auth } from './firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider, // 引入 Google 登入的 Provider
  signInWithPopup,    // 引入彈出視窗登入的函式
  linkWithPopup,      // 引入帳號連結的函式
} from 'firebase/auth';

// --- Email/Password Auth ---

// 使用 Email 和密碼註冊
export const signUpWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

// 使用 Email 和密碼登入
export const signInWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

// 登出
export const logOut = () => {
  return signOut(auth);
};

// --- Auth State Observer ---

// 監聽認證狀態的變化
export const onAuthChanged = (callback) => {
  return onAuthStateChanged(auth, callback);
};


// --- Google Auth Provider ---

// 建立一個 GoogleAuthProvider 的實例
const googleProvider = new GoogleAuthProvider();

// 新增 Google Drive API 的授權範圍 (Scope)
// 這樣在登入時，Google 就會一併詢問使用者是否同意授權應用程式讀取他們的 Google Drive 檔案
googleProvider.addScope('https://www.googleapis.com/auth/drive.readonly');


// 使用 Google 帳號進行登入或連結
export const signInWithGoogle = async () => {
  try {
    // 檢查使用者是否已經登入
    const user = auth.currentUser;
    if (user) {
      // 如果已經登入，則將 Google 帳號連結到現有帳號
      const result = await linkWithPopup(user, googleProvider);
      console.log("Google 帳號成功連結！");
      return result;
    } else {
      // 如果尚未登入，則使用 Google 帳號進行登入
      const result = await signInWithPopup(auth, googleProvider);
      console.log("Google 帳號成功登入！");
      return result;
    }
  } catch (error) {
    console.error("Google 登入或連結失敗:", error);
    // 處理常見錯誤，例如帳號已存在於另一個帳戶
    if (error.code === 'auth/credential-already-in-use') {
      alert('這個 Google 帳號已經被另一個使用者綁定。');
    }
    return null;
  }
};

