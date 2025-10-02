<!-- File: /src/views/LoginView.vue -->
<!-- 說明：這是使用者登入頁面的元件，已新增 Google 登入按鈕 -->
<template>
  <div class="login-view">
    <div class="login-panel">
      <h2>智慧班級管理平台</h2>
      <p>請登入以繼續</p>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label for="email">電子郵件</label>
          <input id="email" type="email" v-model="email" required placeholder="name@example.com">
        </div>
        <div class="form-group">
          <label for="password">密碼</label>
          <input id="password" type="password" v-model="password" required placeholder="••••••••">
        </div>
        <div v-if="error" class="error-message">{{ error }}</div>
        <BaseButton type="submit" class="login-button">使用 Email 登入</BaseButton>
      </form>

      <div class="divider">或</div>

      <BaseButton @click="handleGoogleLogin" class="google-login-button">
        <svg aria-hidden="true" class="google-icon" width="18" height="18" viewBox="0 0 18 18"><path d="M16.51 8.1H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6c1.52-1.38 2.38-3.23 2.38-5.05 0-.5-.05-.92-.15-1.34z" fill="#4285F4"></path><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2c-.74.5-1.68.78-2.7.78-2.07 0-3.82-1.4-4.45-3.28H1.85v2.07C3.25 15.6 5.91 17 8.98 17z" fill="#34A853"></path><path d="M4.53 10.71a4.62 4.62 0 0 1 0-3.42V5.21H1.85A8.99 8.99 0 0 0 1 8.99a8.99 8.99 0 0 0 .85 3.78l2.68-2.06z" fill="#FBBC05"></path><path d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3C12.95 1.66 11.13 1 8.98 1 5.91 1 3.25 2.4 1.85 4.85l2.68 2.07c.63-1.88 2.38-3.28 4.45-3.28z" fill="#EA4335"></path></svg>
        <span>使用 Google 登入</span>
      </BaseButton>

    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/authStore';
import { signInWithEmail, signInWithGoogle } from '../../services/authService';
import BaseButton from '../../components/shared/BaseButton.vue';

const email = ref('');
const password = ref('');
const error = ref(null);
const router = useRouter();
const authStore = useAuthStore();

const handleLogin = async () => {
  error.value = null;
  try {
    await signInWithEmail(email.value, password.value);
    router.push('/dashboard');
  } catch (err) {
    error.value = '登入失敗，請檢查您的帳號或密碼。';
    console.error(err);
  }
};

const handleGoogleLogin = async () => {
  error.value = null;
  try {
    const result = await signInWithGoogle();
    if (result) {
      router.push('/dashboard');
    }
  } catch (err) {
    error.value = 'Google 登入失敗，請稍後再試。';
    console.error(err);
  }
};

</script>

<style scoped>
.login-view {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f0f2f5;
}
.login-panel {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}
.login-panel h2 {
  margin-bottom: 0.5rem;
  font-size: 1.8rem;
}
.login-panel p {
  margin-bottom: 2rem;
  color: #666;
}
.login-form {
  text-align: left;
}
.form-group {
  margin-bottom: 1.5rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}
.error-message {
  color: #d93025;
  margin-bottom: 1rem;
  text-align: center;
}
.login-button {
  width: 100%;
  padding: 0.8rem;
}
.divider {
  margin: 1.5rem 0;
  color: #aaa;
  position: relative;
  text-align: center;
}
.divider::before, .divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 40%;
  height: 1px;
  background-color: #ddd;
}
.divider::before { left: 0; }
.divider::after { right: 0; }

.google-login-button {
  width: 100%;
  padding: 0.8rem;
  background-color: #fff;
  color: #333;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
}
.google-login-button:hover {
  background-color: #f8f8f8;
}
</style>

