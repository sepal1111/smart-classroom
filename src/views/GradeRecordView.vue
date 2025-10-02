<!-- File: /src/views/GradeRecordView.vue -->
<template>
    <div class="grade-record-view">
      <header class="view-header">
        <h1>成績紀錄</h1>
        <div class="header-actions">
          <BaseButton @click="openAddAssessmentModal">新增評量項目</BaseButton>
        </div>
      </header>
  
      <div class="content-area">
        <!-- 評量項目選擇 -->
        <div class="assessment-selector">
          <h3>評量項目</h3>
          <ul class="assessment-list">
            <li
              v-for="assessment in classStore.assessments"
              :key="assessment.id"
              :class="{ active: selectedAssessment && selectedAssessment.id === assessment.id }"
              @click="selectAssessment(assessment)"
            >
              {{ assessment.name }}
            </li>
             <li v-if="!classStore.assessments.length" class="no-assessment">
              請先新增評量項目
            </li>
          </ul>
        </div>
  
        <!-- 成績輸入表格 -->
        <div class="grade-table-container">
          <div v-if="selectedAssessment">
            <h2>{{ selectedAssessment.name }} - 成績輸入</h2>
            <div class="grade-table">
              <div class="table-header">
                <div class="header-cell">座號</div>
                <div class="header-cell">姓名</div>
                <div class="header-cell">分數</div>
              </div>
              <div class="table-body">
                <div v-for="student in classStore.students" :key="student.id" class="table-row">
                  <div class="body-cell">{{ student.seatNumber }}</div>
                  <div class="body-cell">{{ student.name }}</div>
                  <div class="body-cell">
                    <input 
                      type="number" 
                      class="score-input"
                      :value="getStudentGrade(student.id)"
                      @input="updateStudentGrade(student.id, $event.target.value)"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="save-action">
               <BaseButton @click="saveGrades" :disabled="!isGradesChanged">儲存成績</BaseButton>
            </div>
          </div>
          <div v-else class="no-selection-message">
            <p>請從左側選擇一個評量項目以開始紀錄成績。</p>
          </div>
        </div>
      </div>
  
      <!-- 新增評量項目 Modal -->
      <BaseModal :is-open="isModalOpen" @close="closeModal">
          <template #header>
              <h2>新增評量項目</h2>
          </template>
          <template #body>
              <form @submit.prevent="handleAddAssessment" class="assessment-form">
                  <div class="form-group">
                      <label for="assessmentName">項目名稱</label>
                      <input id="assessmentName" v-model="newAssessmentName" type="text" placeholder="例如：期中考" required />
                  </div>
              </form>
          </template>
          <template #footer>
              <BaseButton @click="closeModal" class="secondary">取消</BaseButton>
              <BaseButton @click="handleAddAssessment">建立</BaseButton>
          </template>
      </BaseModal>
  
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useClassStore } from '../../stores/classStore';
  import BaseButton from '../../components/shared/BaseButton.vue';
  import BaseModal from '../../components/shared/BaseModal.vue';
  
  const classStore = useClassStore();
  const selectedAssessment = ref(null);
  const isModalOpen = ref(false);
  const newAssessmentName = ref('');
  const studentGrades = ref(new Map());
  const originalGrades = ref(new Map());
  const isGradesChanged = ref(false);
  
  onMounted(async () => {
    await classStore.fetchStudents();
    await classStore.fetchAssessments();
  });
  
  watch(studentGrades, () => {
      isGradesChanged.value = true;
  }, { deep: true });
  
  const selectAssessment = async (assessment) => {
    selectedAssessment.value = assessment;
    const grades = await classStore.fetchGradesForAssessment(assessment.id);
    studentGrades.value = new Map(grades);
    originalGrades.value = new Map(grades);
    isGradesChanged.value = false;
  };
  
  const getStudentGrade = (studentId) => {
      return studentGrades.value.get(studentId) || '';
  };
  
  const updateStudentGrade = (studentId, score) => {
      const newGrades = new Map(studentGrades.value);
      newGrades.set(studentId, score);
      studentGrades.value = newGrades;
  };
  
  const openAddAssessmentModal = () => {
      newAssessmentName.value = '';
      isModalOpen.value = true;
  };
  
  const closeModal = () => {
      isModalOpen.value = false;
  };
  
  const handleAddAssessment = async () => {
      if(newAssessmentName.value.trim()){
          await classStore.addAssessment({ name: newAssessmentName.value.trim() });
          closeModal();
      }
  };
  
  const saveGrades = async () => {
      if(selectedAssessment.value) {
          await classStore.saveGradesForAssessment(
              selectedAssessment.value.id,
              Array.from(studentGrades.value.entries())
          );
          isGradesChanged.value = false;
          alert('成績已成功儲存！');
      }
  };
  
  </script>
  
  <style scoped>
  .grade-record-view {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .view-header {
    margin-bottom: 1.5rem;
  }
  .content-area {
    display: flex;
    gap: 2rem;
    flex-grow: 1;
  }
  .assessment-selector {
    width: 250px;
    flex-shrink: 0;
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
  }
  .assessment-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .assessment-list li {
    padding: 0.75rem 1rem;
    margin-bottom: 0.5rem;
    border-radius: 6px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  .assessment-list li:hover {
    background-color: #e9ecef;
  }
  .assessment-list li.active {
    background-color: #1967d2;
    color: white;
    font-weight: 500;
  }
  .no-assessment {
      text-align: center;
      color: #888;
      font-style: italic;
  }
  .grade-table-container {
    flex-grow: 1;
  }
  .no-selection-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center;
    color: #777;
    background-color: #f8f9fa;
    border-radius: 8px;
  }
  
  /* Grade Table Styles */
  .grade-table {
    border: 1px solid #dee2e6;
    border-radius: 8px;
    overflow: hidden;
  }
  .table-header {
    display: grid;
    grid-template-columns: 100px 1fr 120px;
    background-color: #f8f9fa;
    font-weight: 600;
    border-bottom: 1px solid #dee2e6;
  }
  .header-cell {
    padding: 0.75rem 1rem;
  }
  .table-body {
    max-height: 60vh;
    overflow-y: auto;
  }
  .table-row {
    display: grid;
    grid-template-columns: 100px 1fr 120px;
    align-items: center;
  }
  .table-row:not(:last-child) {
    border-bottom: 1px solid #e9ecef;
  }
  .body-cell {
    padding: 0.5rem 1rem;
  }
  .score-input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    text-align: center;
  }
  .save-action {
      margin-top: 1.5rem;
      text-align: right;
  }
  /* Form Styles */
  .assessment-form .form-group {
    margin-bottom: 1.5rem;
  }
  
  .assessment-form label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }
  
  .assessment-form input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
    box-sizing: border-box;
  }
  </style>
  
  