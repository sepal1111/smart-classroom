<!-- File: /src/views/AttendanceView.vue -->
<template>
    <div class="attendance-view">
      <header class="view-header">
        <h1>出缺席紀錄</h1>
        <div class="header-actions">
          <input type="date" v-model="selectedDate" class="date-picker"/>
          <BaseButton @click="saveAttendance" :disabled="!isDataChanged">儲存紀錄</BaseButton>
        </div>
      </header>
  
      <div class="attendance-grid">
        <div v-for="student in classStore.students" :key="student.id" class="student-attendance-card">
          <div class="student-info">
            <span class="seat-number">{{ student.seatNumber }}</span>
            <span class="student-name">{{ student.name }}</span>
          </div>
          <div class="status-buttons">
            <button
              v-for="status in attendanceStatuses"
              :key="status.value"
              :class="['status-btn', status.value.toLowerCase(), { active: getStudentStatus(student.id) === status.value }]"
              @click="setStudentStatus(student.id, status.value)"
            >
              {{ status.text }}
            </button>
          </div>
        </div>
         <div v-if="classStore.students.length === 0" class="no-student-message">
          <p>請先至「學生管理」頁面新增學生資料。</p>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useClassStore } from '../../stores/classStore';
  import BaseButton from '../../components/shared/BaseButton.vue';
  
  // Helper to get today's date in YYYY-MM-DD format
  const getTodaysDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };
  
  const classStore = useClassStore();
  const selectedDate = ref(getTodaysDate());
  const attendanceRecords = ref(new Map());
  const originalRecords = ref(new Map());
  const isDataChanged = ref(false);
  
  
  const attendanceStatuses = [
    { text: '在學', value: 'Present' },
    { text: '缺席', value: 'Absent' },
    { text: '遲到', value: 'Late' },
    { text: '請假', value: 'Excused' },
  ];
  
  const loadAttendanceForDate = async (date) => {
    const records = await classStore.fetchAttendanceForDate(date);
    attendanceRecords.value = new Map(records);
    originalRecords.value = new Map(records); // Store a copy for comparison
    isDataChanged.value = false; // Reset changed status
  };
  
  onMounted(async () => {
    await classStore.fetchStudents();
    await loadAttendanceForDate(selectedDate.value);
  });
  
  // Watch for date changes to load new records
  watch(selectedDate, (newDate) => {
    loadAttendanceForDate(newDate);
  });
  
  // Watch for changes in records to enable save button
  watch(attendanceRecords, () => {
    isDataChanged.value = true;
  }, { deep: true });
  
  const getStudentStatus = (studentId) => {
    // Default to 'Present' if no record exists
    return attendanceRecords.value.get(studentId) || 'Present';
  };
  
  const setStudentStatus = (studentId, status) => {
    // Create a new map to ensure reactivity
    const newRecords = new Map(attendanceRecords.value);
    newRecords.set(studentId, status);
    attendanceRecords.value = newRecords;
  };
  
  const saveAttendance = async () => {
    await classStore.saveAttendanceForDate(selectedDate.value, Array.from(attendanceRecords.value.entries()));
    originalRecords.value = new Map(attendanceRecords.value);
    isDataChanged.value = false;
    alert(`已成功儲存 ${selectedDate.value} 的出缺席紀錄！`);
  };
  
  </script>
  
  <style scoped>
  .attendance-view {
    padding: 1rem;
  }
  
  .view-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }
  
  .header-actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }
  
  .date-picker {
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .attendance-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1rem;
  }
  
  .student-attendance-card {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.05);
    padding: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
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
  }
  
  .student-name {
    font-weight: 500;
  }
  
  .status-buttons {
    display: flex;
    gap: 0.5rem;
  }
  
  .status-btn {
    padding: 0.4rem 0.8rem;
    border: 1px solid #ccc;
    background-color: #f0f0f0;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.8rem;
  }
  
  .status-btn.active {
    color: #fff;
    border-color: transparent;
  }
  
  .status-btn.present.active { background-color: #34a853; } /* Green */
  .status-btn.absent.active { background-color: #ea4335; } /* Red */
  .status-btn.late.active { background-color: #fbbc05; } /* Yellow */
  .status-btn.excused.active { background-color: #4285f4; } /* Blue */
  
  .no-student-message {
    text-align: center;
    grid-column: 1 / -1;
    padding: 3rem;
    background-color: #fafafa;
    border-radius: 8px;
    color: #777;
  }
  
  </style>
  
  