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
            <p v-if="!authStore.isGoogleLinked" class="google-link-warning">
                <strong>注意：</strong>您需要先在頂部導覽列「連結 Google 帳號」，才能使用檔案上傳功能。
            </p>
            <ul class="student-submission-list">
              <li v-for="student in classStore.students" :key="student.id" class="student-item">
                <div class="student-info">
                  <span class="seat-number">{{ student.seatNumber }}</span>
                  <span class="student-name">{{ student.name }}</span>
                </div>
                <div class="submission-status">
                  <!-- 已繳交 -->
                  <div v-if="getSubmission(student.id)" class="status-submitted">
                      <a :href="getSubmission(student.id).webViewLink" target="_blank" rel="noopener noreferrer" :title="getSubmission(student.id).fileName">
                          <img :src="getSubmission(student.id).iconLink" alt="file icon" class="file-icon" />
                          <span>{{ getSubmission(student.id).fileName }}</span>
                      </a>
                  </div>
                  <!-- 未繳交 -->
                  <div v-else class="status-not-submitted">
                      <div v-if="uploadingStudentId === student.id" class="uploading-indicator">
                          <LoadingSpinner />
                          <span>上傳中...</span>
                      </div>
                      <div v-else class="upload-form">
                         <input type="file" :id="'file-input-' + student.id" @change="handleFileSelect($event, student.id)" class="file-input" />
                         <label :for="'file-input-' + student.id" class="file-label" :title="selectedFiles.get(student.id)?.name">
                            {{ selectedFiles.has(student.id) ? '已選檔案' : '選擇檔案' }}
                         </label>
                         <BaseButton 
                           @click="handleFileUpload(student)" 
                           :disabled="!selectedFiles.has(student.id) || !authStore.isGoogleLinked" 
                           small>
                           上傳
                         </BaseButton>
                      </div>
                  </div>
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
import { useAuthStore } from '../../stores/authStore';
import BaseButton from '../../components/shared/BaseButton.vue';
import BaseModal from '../../components/shared/BaseModal.vue';
import LoadingSpinner from '../../components/shared/LoadingSpinner.vue';

const classStore = useClassStore();
const authStore = useAuthStore();
const selectedAssignment = ref(null);
const isModalOpen = ref(false);
const newAssignment = ref({ name: '', dueDate: '' });
const submissions = ref(new Map()); // Map<studentId, submissionData>
const selectedFiles = ref(new Map()); // Map<studentId, File>
const uploadingStudentId = ref(null); // Track which student's file is uploading

onMounted(async () => {
  await classStore.fetchStudents();
  await classStore.fetchAssignments();
});

const selectAssignment = async (assignment) => {
  selectedAssignment.value = assignment;
  const fetchedSubmissions = await classStore.fetchSubmissionsForAssignment(assignment.id);
  submissions.value = new Map(fetchedSubmissions);
  selectedFiles.value.clear();
};

const getSubmission = (studentId) => {
    return submissions.value.get(studentId);
};

const handleFileSelect = (event, studentId) => {
  const file = event.target.files[0];
  const newSelectedFiles = new Map(selectedFiles.value);
  if (file) {
    newSelectedFiles.set(studentId, file);
  } else {
    newSelectedFiles.delete(studentId);
  }
  selectedFiles.value = newSelectedFiles;
};

const handleFileUpload = async (student) => {
  const file = selectedFiles.value.get(student.id);
  if (!file || !selectedAssignment.value) {
    alert('請先選擇檔案');
    return;
  }
  uploadingStudentId.value = student.id;
  try {
    const submissionData = await classStore.submitAssignmentFile(selectedAssignment.value, student, file);
    const newSubmissions = new Map(submissions.value);
    newSubmissions.set(student.id, submissionData);
    submissions.value = newSubmissions;
    selectedFiles.value.delete(student.id);
  } catch (error) {
    alert(`上傳失敗: ${error.message}`);
  } finally {
    uploadingStudentId.value = null;
  }
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
.assignment-view { display: flex; flex-direction: column; height: 100%; }
.content-area { display: flex; gap: 2rem; flex-grow: 1; }
.assignment-selector { width: 280px; flex-shrink: 0; background-color: #f8f9fa; padding: 1rem; border-radius: 8px; }
.assignment-list { list-style: none; padding: 0; margin: 0; }
.assignment-list li { padding: 0.75rem 1rem; margin-bottom: 0.5rem; border-radius: 6px; cursor: pointer; transition: background-color 0.2s; border: 1px solid #e9ecef; }
.assignment-list li:hover { background-color: #e9ecef; }
.assignment-list li.active { background-color: #1967d2; color: white; border-color: #1967d2; }
.assignment-name { display: block; font-weight: 500; margin-bottom: 0.25rem; }
.due-date { font-size: 0.8rem; opacity: 0.8; }
.submission-status-container { flex-grow: 1; }
.student-submission-list { list-style: none; padding: 0; margin-top: 1.5rem; max-height: 70vh; overflow-y: auto; }
.student-item { display: flex; justify-content: space-between; align-items: center; padding: 1rem; border-radius: 6px; }
.student-item:nth-child(odd) { background-color: #f8f9fa; }
.student-info { display: flex; align-items: center; gap: 1rem; }
.seat-number { background-color: #e8f0fe; color: #1967d2; width: 32px; height: 32px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-weight: bold; flex-shrink: 0; }
.student-name { font-weight: 500; }
.no-selection-message, .no-assignment { text-align: center; padding: 2rem; color: #777; font-style: italic; }
.assignment-form .form-group { margin-bottom: 1.5rem; }
.assignment-form label { display: block; margin-bottom: 0.5rem; font-weight: 500; color: #333; }
.assignment-form input { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; font-size: 1rem; box-sizing: border-box; }
.google-link-warning { background-color: #fff3cd; color: #856404; padding: 1rem; border: 1px solid #ffeeba; border-radius: 8px; margin-bottom: 1.5rem; }
.submission-status { flex-grow: 1; display: flex; justify-content: flex-end; align-items: center; max-width: 50%; }
.status-submitted a { display: inline-flex; align-items: center; gap: 0.5rem; color: #1e8e3e; text-decoration: none; background-color: #e6f4ea; padding: 0.4rem 0.75rem; border-radius: 16px; font-weight: 500; transition: background-color 0.2s; max-width: 250px; }
.status-submitted a:hover { background-color: #d4eedd; }
.status-submitted span { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.file-icon { width: 16px; height: 16px; flex-shrink: 0; }
.upload-form { display: flex; align-items: center; gap: 0.5rem; }
.uploading-indicator { display: flex; align-items: center; gap: 0.5rem; color: #555; }
.file-input { width: 0.1px; height: 0.1px; opacity: 0; overflow: hidden; position: absolute; z-index: -1; }
.file-label { padding: 0.4rem 0.8rem; border: 1px solid #ccc; background-color: #f0f0f0; border-radius: 4px; cursor: pointer; font-size: 0.9rem; white-space: nowrap; }
.file-label:hover { background-color: #e0e0e0; }
</style>
