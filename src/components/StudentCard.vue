<!-- File: /src/components/StudentCard.vue -->
<template>
    <div class="student-card">
      <div class="card-header">
        <div class="avatar-placeholder">
          <span>{{ student.name.charAt(0) }}</span>
        </div>
        <div class="student-details">
          <h3 class="student-name">{{ student.name }}</h3>
          <p class="student-id">學號: {{ student.studentId }}</p>
        </div>
      </div>
      <div class="card-body">
         <p class="seat-info">座號: <strong>{{ student.seatNumber }}</strong></p>
      </div>
      <div class="card-footer">
        <button class="action-btn edit" @click="onEdit">編輯</button>
        <button class="action-btn delete" @click="onDelete">刪除</button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    student: {
      type: Object,
      required: true,
    },
  });
  
  const emit = defineEmits(['edit', 'delete']);
  
  const onEdit = () => {
    emit('edit', props.student);
  };
  
  const onDelete = () => {
    // 為了安全，通常會在這裡彈出確認視窗
    // if (confirm(`確定要刪除 ${props.student.name} 嗎？`)) {
       emit('delete', props.student.id);
    // }
  };
  </script>
  
  <style scoped>
  .student-card {
    background-color: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border: 1px solid #e0e0e0;
    display: flex;
    flex-direction: column;
    transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  }
  
  .student-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  }
  
  .card-header {
    display: flex;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #f0f0f0;
  }
  
  .avatar-placeholder {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: #d1e3ff;
    color: #1967d2;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    font-weight: bold;
    margin-right: 1rem;
  }
  
  .student-name {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
    color: #333;
  }
  
  .student-id {
    margin: 0;
    font-size: 0.85rem;
    color: #777;
  }
  
  .card-body {
    padding: 1rem;
    flex-grow: 1;
  }
  
  .seat-info {
    margin: 0;
    font-size: 0.9rem;
    color: #555;
  }
  
  .seat-info strong {
    font-size: 1.2rem;
    color: #1967d2;
  }
  
  .card-footer {
    display: flex;
    justify-content: flex-end;
    padding: 0.75rem 1rem;
    background-color: #f9fafb;
    border-top: 1px solid #f0f0f0;
    border-bottom-left-radius: 12px;
    border-bottom-right-radius: 12px;
  }
  
  .action-btn {
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    margin-left: 0.5rem;
  }
  
  .action-btn.edit {
    background-color: #e0e0e0;
    color: #333;
  }
  .action-btn.edit:hover {
    background-color: #d1d1d1;
  }
  
  .action-btn.delete {
    background-color: #fde2e2;
    color: #c53030;
  }
  .action-btn.delete:hover {
    background-color: #f9caca;
  }
  </style>
  
  