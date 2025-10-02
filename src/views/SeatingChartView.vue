<!-- File: /src/views/SeatingChartView.vue -->
<template>
    <div class="seating-chart-view">
      <header class="view-header">
        <h1>座位表管理</h1>
        <div class="header-actions">
          <BaseButton @click="saveLayout" :disabled="!isLayoutChanged">儲存座位表</BaseButton>
        </div>
      </header>
  
      <div class="main-layout">
        <!-- 座位表區域 -->
        <div class="chart-container">
          <div class="podium">講台</div>
          <div 
            class="seating-grid" 
            :style="{ gridTemplateColumns: `repeat(${cols}, 1fr)` }"
          >
            <div
              v-for="seat in totalSeats"
              :key="seat"
              class="seat"
              @dragover.prevent
              @drop="onDrop(seat - 1)"
            >
              <div
                v-if="getStudentInSeat(seat - 1)"
                class="student-in-seat"
                draggable="true"
                @dragstart="onDragStart($event, getStudentInSeat(seat - 1))"
              >
                {{ getStudentInSeat(seat - 1)?.name }}
              </div>
              <span v-else class="seat-number">{{ seat }}</span>
            </div>
          </div>
        </div>
  
        <!-- 學生列表區域 -->
        <div class="unseated-students-container">
          <h3>未排入座位的學生</h3>
          <div class="unseated-list" @dragover.prevent @drop="onDrop(-1)">
            <div
              v-for="student in unseatedStudents"
              :key="student.id"
              class="student-draggable"
              draggable="true"
              @dragstart="onDragStart($event, student)"
            >
              {{ student.name }} ({{ student.seatNumber }})
            </div>
             <div v-if="unseatedStudents.length === 0" class="all-seated-message">
              所有學生皆已安排座位！
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, watch } from 'vue';
  import { useClassStore } from '../../stores/classStore';
  import BaseButton from '../../components/shared/BaseButton.vue';
  
  const classStore = useClassStore();
  
  const rows = ref(6);
  const cols = ref(5);
  const isLayoutChanged = ref(false);
  
  // 座位表資料結構：Map<seatIndex, studentId>
  const seatingLayout = ref(new Map());
  
  onMounted(async () => {
    await classStore.fetchStudents();
    // 假設從 store 讀取 layout
    const savedLayout = classStore.seatingChart; // 假設 store 有這個 getter
    if (savedLayout && savedLayout.size > 0) {
      seatingLayout.value = new Map(savedLayout);
    }
  });
  
  // 監聽座位表的變化
  watch(seatingLayout, () => {
    isLayoutChanged.value = true;
  }, { deep: true });
  
  
  const totalSeats = computed(() => rows.value * cols.value);
  
  const seatedStudentIds = computed(() => new Set(seatingLayout.value.values()));
  
  const unseatedStudents = computed(() => {
    return classStore.students.filter(student => !seatedStudentIds.value.has(student.id));
  });
  
  const getStudentInSeat = (seatIndex) => {
    const studentId = seatingLayout.value.get(seatIndex);
    return classStore.students.find(s => s.id === studentId);
  };
  
  const onDragStart = (event, student) => {
    event.dataTransfer.setData('studentId', student.id);
    event.dataTransfer.effectAllowed = 'move';
  };
  
  const onDrop = (toSeatIndex) => {
    const studentId = event.dataTransfer.getData('studentId');
    if (!studentId) return;
  
    // 找出學生目前在哪個位子
    let fromSeatIndex = -1;
    for (const [key, value] of seatingLayout.value.entries()) {
      if (value === studentId) {
        fromSeatIndex = key;
        break;
      }
    }
    
    // 1. 從原位子移除
    if (fromSeatIndex !== -1) {
      seatingLayout.value.delete(fromSeatIndex);
    }
  
    // 2. 放到新位子
    // 如果目標位置是 -1，代表移回未排座位區
    if (toSeatIndex !== -1) {
      // 如果目標位置已經有人，則將該學生移出
      const studentInTargetSeat = getStudentInSeat(toSeatIndex);
      if(studentInTargetSeat) {
          seatingLayout.value.delete(toSeatIndex);
      }
      seatingLayout.value.set(toSeatIndex, studentId);
    }
    
    // 觸發響應式更新
    seatingLayout.value = new Map(seatingLayout.value);
  };
  
  const saveLayout = async () => {
    // 將 Map 轉換為可序列化的格式，例如 [[key, value], ...]
    const layoutToSave = Array.from(seatingLayout.value.entries());
    await classStore.saveSeatingChart(layoutToSave);
    isLayoutChanged.value = false;
    alert('座位表已成功儲存！');
  };
  
  </script>
  
  <style scoped>
  .seating-chart-view {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .view-header {
    margin-bottom: 1.5rem;
  }
  .main-layout {
    display: flex;
    gap: 2rem;
    flex-grow: 1;
  }
  .chart-container {
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    background-color: #f8f9fa;
    padding: 1.5rem;
    border-radius: 8px;
  }
  .podium {
    width: 40%;
    margin: 0 auto 2rem auto;
    padding: 0.5rem;
    text-align: center;
    background-color: #d3d3d3;
    border-radius: 4px;
    font-weight: bold;
  }
  .seating-grid {
    display: grid;
    gap: 1rem;
    flex-grow: 1;
  }
  .seat {
    background-color: #fff;
    border: 1px dashed #ccc;
    border-radius: 8px;
    min-height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 0.2s;
  }
  .seat:hover {
    background-color: #e8f0fe;
  }
  .seat-number {
    color: #ccc;
    font-size: 1.2rem;
  }
  .student-in-seat {
    background-color: #ffffff;
    padding: 0.5rem;
    border-radius: 4px;
    width: 90%;
    height: 90%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
    cursor: grab;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    border: 1px solid #ddd;
  }
  
  .unseated-students-container {
    width: 280px;
    flex-shrink: 0;
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
  }
  
  .unseated-students-container h3 {
    margin-top: 0;
    margin-bottom: 1rem;
    text-align: center;
  }
  .unseated-list {
    background-color: #fff;
    border: 1px solid #eee;
    padding: 0.5rem;
    border-radius: 4px;
    flex-grow: 1;
    overflow-y: auto;
  }
  .student-draggable {
    background-color: #f0f0f0;
    padding: 0.75rem;
    margin-bottom: 0.5rem;
    border-radius: 4px;
    cursor: grab;
    text-align: center;
  }
  .all-seated-message {
    padding: 2rem 1rem;
    text-align: center;
    color: #888;
  }
  </style>
  
  