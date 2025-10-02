// File: /src/router/index.js

import { createRouter, createWebHistory } from 'vue-router';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

// --- View Components ---
import LoginView from '../views/LoginView.vue';
import DashboardView from '../views/DashboardView.vue';
import StudentManageView from '../views/StudentManageView.vue';
import SeatingChartView from '../views/SeatingChartView.vue';
import AttendanceView from '../views/AttendanceView.vue';
import GradeRecordView from '../views/GradeRecordView.vue';
import AssignmentView from '../views/AssignmentView.vue';
import InteractiveView from '../views/InteractiveView.vue';

const routes = [
  { path: '/', redirect: '/dashboard' },
  { 
    path: '/login', 
    name: 'Login', 
    component: LoginView 
  },
  { 
    path: '/dashboard', 
    name: 'Dashboard', 
    component: DashboardView,
    meta: { requiresAuth: true } // 標記此頁面需要登入
  },
  { 
    path: '/students', 
    name: 'StudentManage', 
    component: StudentManageView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/seating-chart', 
    name: 'SeatingChart', 
    component: SeatingChartView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/attendance', 
    name: 'Attendance', 
    component: AttendanceView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/grades', 
    name: 'GradeRecord', 
    component: GradeRecordView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/assignments', 
    name: 'Assignment', 
    component: AssignmentView,
    meta: { requiresAuth: true }
  },
  { 
    path: '/interactive', 
    name: 'Interactive', 
    component: InteractiveView,
    meta: { requiresAuth: true }
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// --- Navigation Guard ---

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener();
        resolve(user);
      },
      reject
    );
  });
};

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const currentUser = await getCurrentUser();

  if (requiresAuth && !currentUser) {
    // 如果頁面需要登入，但使用者未登入，導向登入頁
    next('/login');
  } else if (to.name === 'Login' && currentUser) {
    // 如果使用者已登入，但試圖進入登入頁，導向主控台
    next('/dashboard');
  } else {
    // 其他情況，正常放行
    next();
  }
});

export default router;

