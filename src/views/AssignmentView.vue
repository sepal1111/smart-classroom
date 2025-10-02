<!-- File: /src/views/AssignmentView.vue -->
<template>
    <div class="assignment-view">
      <header class="view-header">
        <h1>數位作品繳交</h1>
        <div class="header-actions">
          <BaseButton @click="openAddModal">新增繳交項目</BaseButton>
        </div>
      </header>
  
      <div class="content-area">
        <!-- 繳交項目選擇 -->
        <div class="assignment-selector">
          <h3>繳交項目</h3>
          <ul class="assignment-list">
            <li
              v-for="assignment in classStore.assignments"
              :key="assignment.id"
              :class="{ active: selectedAssignment && selectedAssignment.id === assignment.id }"
              @click="selectAssignment(assignment)"
            >
              <span class="assignment-name">{{ assignment.name }}</span>
              <span class="due-date">截止日期: {{ assignment.dueDate }}</span>
            </li>
             <li v-if="!classStore.assignments.length" class="no-assignment">
              請先新增繳交項目
            </li>
          </ul>
        </div>
  
        <!-- 學生繳交狀態 -->
        <div class="submission-status-container">
          <div v-if="selectedAssignment">
            <h2>{{ selectedAssignment.name }} - 學生繳交狀態</h2>
            <ul class="student-submission-list">
              <li v-for="student in classStore.students" :key="student.id" class="student-item">
                <div class="student-info">
                  <span class="seat-number">{{ student.seatNumber }}</span>
                  <span class="student-name">{{ student.name }}</span>
                </div>
                <div class="submission-status">
                  <span v-if="getSubmissionStatus(student.id)" class="status-submitted">
                    已繳交
                  </span>
                  <span v-else class="status-not-submitted">
                    未繳交
                  </span>
                </div>
              </li>
            </ul>
          </div>
          <div v-else class="no-selection-message">
            <p>請從左側選擇一個繳交項目以查看學生狀態。</p>
          </div>
        </div>
      </div>
  
      <!-- 新增繳交項目 Modal -->
      <BaseModal :is-open="isModalOpen" @close="closeModal">
          <template #header>
              <h2>新增繳交項目</h2>
          </template>
          <template #body>
              <form @submit.prevent="handleAddAssignment" class="assignment-form">
                  <div class="form-group">
                      <label for="assignmentName">項目名稱</label>
                      <input id="assignmentName" v-model="newAssignment.name" type="text" placeholder="例如：科展研究報告" required />
                  </div>
                   <div class="form-group">
                      <label for="dueDate">繳交截止日期</label>
                      <input id="dueDate" v-model="newAssignment.dueDate" type="date" required />
                  </div>
              </form>
          </template>
          <template #footer>
              <BaseButton @click="closeModal" class="secondary">取消</BaseButton>
              <BaseButton @click="handleAddAssignment">建立</BaseButton>
          </template>
      </BaseModal>
  
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useClassStore } from '../../stores/classStore';
  import BaseButton from '../../components/shared/BaseButton.vue';
  import BaseModal from '../../components/shared/BaseModal.vue';
  
  const classStore = useClassStore();
  const selectedAssignment = ref(null);
  const isModalOpen = ref(false);
  const newAssignment = ref({
      name: '',
      dueDate: ''
  });
  const submissions = ref(new Map()); // Map<studentId, submissionData>
  
  onMounted(async () => {
    await classStore.fetchStudents();
    await classStore.fetchAssignments();
  });
  
  const selectAssignment = async (assignment) => {
    selectedAssignment.value = assignment;
    // 模擬獲取繳交紀錄
    const fetchedSubmissions = await classStore.fetchSubmissionsForAssignment(assignment.id);
    submissions.value = new Map(fetchedSubmissions);
  };
  
  const getSubmissionStatus = (studentId) => {
      return submissions.value.has(studentId);
  };
  
  const openAddModal = () => {
      newAssignment.value = { name: '', dueDate: '' };
      isModalOpen.value = true;
  };
  
  const closeModal = () => {
      isModalOpen.value = false;
  };
  
  const handleAddAssignment = async () => {
      if(newAssignment.value.name.trim() && newAssignment.value.dueDate){
          await classStore.addAssignment(newAssignment.value);
          closeModal();
      }
  };
  
  </script>
  
  <style scoped>
  .assignment-view {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .content-area {
    display: flex;
    gap: 2rem;
    flex-grow: 1;
  }
  .assignment-selector {
    width: 280px;
    flex-shrink: 0;
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
  }
  .assignment-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .assignment-list li {
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
    border: 1px solid #e9ecef;
  }
  .assignment-list li:hover {
    background-color: #e9ecef;
  }
  .assignment-list li.active {
    background-color: #1967d2;
    color: white;
    border-color: #1967d2;
  }
  .assignment-name {
      display: block;
      font-weight: 500;
      margin-bottom: 0.25rem;
  }
  .due-date {
      font-size: 0.8rem;
      opacity: 0.8;
  }
  .submission-status-container {
    flex-grow: 1;
  }
  .student-submission-list {
      list-style: none;
      padding: 0;
      margin-top: 1.5rem;
      max-height: 70vh;
      overflow-y: auto;
  }
  .student-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      border-radius: 6px;
  }
  .student-item:nth-child(odd) {
      background-color: #f8f9fa;
  }
  .student-info {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  .seat-number {
    background-color: #e8f0fe;
    color: #1967d2;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    flex-shrink: 0;
  }
  .student-name {
    font-weight: 500;
  }
  .status-submitted {
      color: #1e8e3e;
      font-weight: bold;
      background-color: #e6f4ea;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
  }
  .status-not-submitted {
      color: #d93025;
      font-weight: bold;
      background-color: #fce8e6;
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
  }
  .no-selection-message, .no-assignment {
      text-align: center;
      padding: 2rem;
      color: #777;
      font-style: italic;
  }
  /* Form Styles */
  .assignment-form .form-group {
    margin-bottom: 1.5rem;
  }
  .assignment-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }
  .assignment-form input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
  }
  </style>
  
  