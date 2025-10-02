<!-- File: /src/views/StudentManageView.vue -->
<template>
    <div class="student-manage">
      <header class="view-header">
        <h1>學生管理</h1>
        <BaseButton @click="openAddModal">新增學生</BaseButton>
      </header>
  
      <!-- 學生列表 -->
      <div v-if="classStore.students.length > 0" class="student-grid">
         <StudentCard
            v-for="student in classStore.students"
            :key="student.id"
            :student="student"
            @edit="openEditModal"
            @delete="handleDeleteStudent"
          />
      </div>
      <div v-else class="no-student-message">
        <p>目前沒有任何學生資料，請點擊「新增學生」來加入第一位學生。</p>
      </div>
  
      <!-- 新增/編輯學生 Modal -->
      <BaseModal :is-open="isModalOpen" @close="closeModal">
        <template #header>
          <h2>{{ isEditing ? '編輯學生資料' : '新增學生' }}</h2>
        </template>
        <template #body>
          <form @submit.prevent="handleSaveStudent" class="student-form">
            <div class="form-group">
              <label for="name">姓名</label>
              <input id="name" v-model="studentForm.name" type="text" required />
            </div>
            <div class="form-group">
              <label for="studentId">學號</label>
              <input id="studentId" v-model="studentForm.studentId" type="text" required />
            </div>
            <div class="form-group">
              <label for="seatNumber">座號</label>
              <input id="seatNumber" v-model.number="studentForm.seatNumber" type="number" required />
            </div>
          </form>
        </template>
        <template #footer>
          <BaseButton @click="closeModal" class="secondary">取消</BaseButton>
          <BaseButton @click="handleSaveStudent">儲存</BaseButton>
        </template>
      </BaseModal>
  
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useClassStore } from '../../stores/classStore';
  import BaseButton from '../../components/shared/BaseButton.vue';
  import BaseModal from '../../components/shared/BaseModal.vue';
  import StudentCard from '../../components/StudentCard.vue';
  
  const classStore = useClassStore();
  const isModalOpen = ref(false);
  const isEditing = ref(false);
  const studentForm = ref({
    id: null,
    name: '',
    studentId: '',
    seatNumber: null,
  });
  
  // 當元件掛載時，從 Firestore 載入學生資料
  onMounted(() => {
    classStore.fetchStudents();
  });
  
  const resetForm = () => {
    studentForm.value = { id: null, name: '', studentId: '', seatNumber: null };
  };
  
  const openAddModal = () => {
    isEditing.value = false;
    resetForm();
    isModalOpen.value = true;
  };
  
  const openEditModal = (student) => {
    isEditing.value = true;
    // 使用解構賦值複製一份，避免直接修改 store 中的原始資料
    studentForm.value = { ...student };
    isModalOpen.value = true;
  };
  
  const closeModal = () => {
    isModalOpen.value = false;
  };
  
  const handleSaveStudent = async () => {
    if (studentForm.value.name && studentForm.value.studentId && studentForm.value.seatNumber) {
      if (isEditing.value) {
        await classStore.updateStudent(studentForm.value.id, studentForm.value);
      } else {
        await classStore.addStudent(studentForm.value);
      }
      closeModal();
    } else {
      alert('請填寫所有欄位');
    }
  };
  
  const handleDeleteStudent = async (studentId) => {
    // 在真實應用中，這裡應該使用一個更美觀的確認對話框
    if (window.confirm('您確定要刪除這位學生嗎？此操作無法復原。')) {
        await classStore.deleteStudent(studentId);
    }
  };
  
  </script>
  
  <style scoped>
  /* 這裡是此元件專屬的 CSS 樣式 */
  .student-manage {
    padding: 1rem;
  }
  
  .view-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .student-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1.5rem;
  }
  
  .no-student-message {
    text-align: center;
    padding: 3rem;
    background-color: #fafafa;
    border-radius: 8px;
    color: #777;
  }
  
  /* Form Styles */
  .student-form .form-group {
    margin-bottom: 1.5rem;
  }
  
  .student-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }
  
  .student-form input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
  }
  </style>
  
  