<!-- File: /src/views/InteractiveView.vue -->
<template>
    <div class="interactive-view-v2">
      <header class="view-header">
        <h1>課堂即時互動</h1>
      </header>
  
      <div class="main-layout">
        <!-- 左側：控制與題目設定 -->
        <div class="control-panel">
          <h3>互動工具箱</h3>
          <div class="question-type-selector">
            <BaseButton
              v-for="q_type in questionTypes"
              :key="q_type.type"
              @click="prepareQuestion(q_type.type)"
              :class="{ active: currentQuestion.type === q_type.type && !session?.isLive }"
              :disabled="session?.isLive"
            >
              {{ q_type.name }}
            </BaseButton>
          </div>
  
          <!-- 題目設定區 -->
          <div v-if="currentQuestion.type && !session?.isLive" class="question-editor">
            <h4>題目設定</h4>
            <div class="form-group">
              <label>題目說明 (選填)</label>
              <input type="text" v-model="currentQuestion.title" placeholder="請輸入題目說明..." />
            </div>
            <!-- 選項設定 -->
            <div v-if="['single-choice', 'multi-choice'].includes(currentQuestion.type)">
               <div v-for="(option, index) in currentQuestion.options" :key="index" class="form-group option-input">
                  <label>選項 {{ String.fromCharCode(65 + index) }}</label>
                  <input type="text" v-model="option.text" />
               </div>
            </div>
            <BaseButton @click="handleStartInteraction" class="start-button">開始互動</BaseButton>
          </div>
        </div>
  
        <!-- 右側：結果顯示區 -->
        <div class="display-panel">
          <div v-if="!session?.isLive" class="placeholder">
            <h2>請從左側選擇一種互動模式</h2>
            <p>開始一場即時的課堂問答吧！</p>
          </div>
          <div v-else class="live-interaction">
              <h3>{{ session.title || '互動進行中...' }}</h3>
              <div class="stats">
                  <span>作答人數: {{ answeredCount }} / {{ classStore.students.length }}</span>
              </div>
              
              <!-- 結果顯示區 -->
              <div class="results-container">
                <!-- 長條圖 (選擇題) -->
                <div v-if="['single-choice', 'multi-choice', 'true-false'].includes(session.type)" class="chart-container">
                    <div v-for="(option, index) in session.options" :key="index" class="bar-item">
                        <span class="option-label">{{ String.fromCharCode(65 + index) }}. {{ option.text }}</span>
                        <div class="bar">
                            <div class="bar-fill" :style="{ width: getOptionPercentage(index) + '%' }"></div>
                        </div>
                        <span class="percentage-label">{{ getOptionPercentage(index).toFixed(1) }}% ({{ getOptionCount(index) }})</span>
                    </div>
                </div>
                <!-- 繪圖牆 (繪圖題) -->
                <div v-else-if="session.type === 'drawing'" class="drawing-gallery">
                    <div v-for="studentId in Object.keys(session.answers || {})" :key="studentId" class="drawing-item">
                        <img :src="session.answers[studentId].imageData" alt="學生作品" />
                        <span>{{ getStudentName(studentId) }}</span>
                    </div>
                </div>
                <!-- 文字雲/列表 (文字題) -->
                <div v-else-if="session.type === 'text'" class="text-answers">
                    <div v-for="studentId in Object.keys(session.answers || {})" :key="studentId" class="text-item">
                        <strong>{{ getStudentName(studentId) }}:</strong>
                        <span>{{ session.answers[studentId].text }}</span>
                    </div>
                </div>
              </div>
              <BaseButton @click="handleEndInteraction" class="secondary">結束互動</BaseButton>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, onUnmounted, computed } from 'vue';
  import { useClassStore } from '../../stores/classStore';
  import BaseButton from '../../components/shared/BaseButton.vue';
  
  const classStore = useClassStore();
  
  const questionTypes = [
    { type: 'single-choice', name: '單選題' },
    { type: 'multi-choice', name: '多選題' },
    { type: 'true-false', name: '是非題' },
    { type: 'text', name: '文字題' },
    { type: 'drawing', name: '繪圖題' },
  ];
  
  // 從 Store 取得即時 session 資料
  const session = computed(() => classStore.liveInteractionSession);
  
  const currentQuestion = ref({});
  
  // --- Lifecycle Hooks ---
  onMounted(() => {
    classStore.subscribeToInteraction();
    if(!classStore.students.length){
        classStore.fetchStudents();
    }
  });
  
  onUnmounted(() => {
    classStore.unsubscribeFromInteraction();
  });
  
  // --- Computed Properties for Results ---
  const answeredCount = computed(() => {
      return session.value?.answers ? Object.keys(session.value.answers).length : 0;
  });
  
  const getOptionCount = (optionIndex) => {
      if (!session.value?.answers) return 0;
      const answers = Object.values(session.value.answers);
      if (session.value.type === 'single-choice' || session.value.type === 'true-false') {
          return answers.filter(ans => ans.selected === optionIndex).length;
      }
      if (session.value.type === 'multi-choice') {
          return answers.filter(ans => ans.selected.includes(optionIndex)).length;
      }
      return 0;
  };
  
  const getOptionPercentage = (optionIndex) => {
      if (answeredCount.value === 0) return 0;
      const count = getOptionCount(optionIndex);
      // 多選題的分母可以是總作答人數，也可以是總勾選數，這裡先用總人數
      return (count / answeredCount.value) * 100;
  };
  
  const getStudentName = (studentId) => {
      const student = classStore.students.find(s => s.id === studentId);
      return student ? student.name : '未知學生';
  };
  
  // --- Methods ---
  const createDefaultQuestion = (type) => {
    const base = { type, title: '', options: [] };
    switch (type) {
      case 'single-choice':
      case 'multi-choice':
        base.options = [{ text: '選項A' }, { text: '選項B' }, { text: '選項C' }, { text: '選項D' }];
        break;
      case 'true-false':
         base.options = [{ text: '是' }, { text: '否' }];
         break;
    }
    return base;
  };
  
  const prepareQuestion = (type) => {
    currentQuestion.value = createDefaultQuestion(type);
  };
  
  const handleStartInteraction = () => {
      if(!currentQuestion.value.type) return;
      classStore.startInteraction(currentQuestion.value);
  };
  
  const handleEndInteraction = () => {
      classStore.endInteraction();
      currentQuestion.value = {}; // 清空題目編輯器
  };
  
  </script>
  
  <style scoped>
  .interactive-view-v2 { display: flex; flex-direction: column; height: 100%; }
  .main-layout { display: flex; gap: 2rem; flex-grow: 1; }
  .control-panel { width: 350px; flex-shrink: 0; background-color: #f8f9fa; padding: 1.5rem; border-radius: 12px; }
  .question-type-selector { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; margin-top: 1rem; }
  .question-type-selector .active { background-color: #1967d2; color: white; }
  .question-editor { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid #e0e0e0; }
  .form-group { margin-bottom: 1rem; }
  .form-group label { display: block; margin-bottom: 0.5rem; font-size: 0.9rem; font-weight: 500; }
  .form-group input { width: 100%; padding: 0.75rem; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box; }
  .option-input { display: flex; align-items: center; gap: 0.5rem; }
  .option-input label { flex-shrink: 0; margin-bottom: 0; }
  .start-button { width: 100%; margin-top: 1rem; padding: 0.8rem; }
  .display-panel { flex-grow: 1; display: flex; justify-content: center; align-items: center; text-align: center; background-color: #f8f9fa; border-radius: 12px; padding: 2rem; }
  .placeholder h2 { font-size: 1.8rem; color: #555; }
  .placeholder p { color: #777; }
  .live-interaction { width: 100%; }
  .live-interaction h3 { font-size: 1.5rem; margin-bottom: 1rem; }
  .stats { margin-bottom: 2rem; color: #666; }
  .results-container { min-height: 300px; margin-bottom: 2rem; width: 100%; }
  .chart-container { display: flex; flex-direction: column; gap: 1rem; text-align: left; }
  .bar-item { display: flex; align-items: center; gap: 1rem; }
  .option-label { flex-basis: 120px; flex-shrink: 0; }
  .bar { flex-grow: 1; background-color: #e0e0e0; border-radius: 4px; height: 20px; overflow: hidden; }
  .bar-fill { background-color: #4285f4; height: 100%; transition: width 0.3s ease-out; }
  .percentage-label { flex-basis: 80px; flex-shrink: 0; text-align: right; }
  .drawing-gallery { display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 1rem; max-height: 400px; overflow-y: auto; }
  .drawing-item { display: flex; flex-direction: column; align-items: center; }
  .drawing-item img { width: 100%; border: 1px solid #ccc; border-radius: 4px; }
  .drawing-item span { font-size: 0.8rem; margin-top: 0.5rem; }
  .text-answers { max-height: 400px; overflow-y: auto; text-align: left; }
  .text-item { background-color: white; padding: 0.5rem 1rem; border-radius: 4px; margin-bottom: 0.5rem; }
  </style>
  
  