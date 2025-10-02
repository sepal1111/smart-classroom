<!-- File: /src/components/shared/DrawingCanvas.vue -->
<!-- 這是一個可複用的繪圖板元件 -->
<template>
  <div class="drawing-canvas-wrapper">
    <div class="toolbar">
      <div class="tool-group">
        <label>顏色:</label>
        <input type="color" v-model="brushColor" />
      </div>
      <div class="tool-group">
        <label>粗細:</label>
        <input type="range" v-model="brushSize" min="1" max="50" />
        <span>{{ brushSize }}</span>
      </div>
      <BaseButton @click="clearCanvas" class="secondary small">清除畫布</BaseButton>
    </div>
    <canvas ref="canvasRef" @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing" @mouseleave="stopDrawing"></canvas>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import BaseButton from './BaseButton.vue';

const canvasRef = ref(null);
const context = ref(null);
const isDrawing = ref(false);
const brushColor = ref('#000000');
const brushSize = ref(5);

let lastX = 0;
let lastY = 0;

onMounted(() => {
  const canvas = canvasRef.value;
  context.value = canvas.getContext('2d');
  
  // Set canvas size based on parent container
  const parent = canvas.parentElement;
  canvas.width = parent.clientWidth;
  canvas.height = parent.clientHeight - 50; // a_height for toolbar
  
  context.value.lineCap = 'round';
  context.value.lineJoin = 'round';
});


const startDrawing = (e) => {
  isDrawing.value = true;
  [lastX, lastY] = [e.offsetX, e. offsetY];
};

const draw = (e) => {
  if (!isDrawing.value) return;
  context.value.strokeStyle = brushColor.value;
  context.value.lineWidth = brushSize.value;
  
  context.value.beginPath();
  context.value.moveTo(lastX, lastY);
  context.value.lineTo(e.offsetX, e.offsetY);
  context.value.stroke();
  
  [lastX, lastY] = [e.offsetX, e.offsetY];
};

const stopDrawing = () => {
  isDrawing.value = false;
};

const clearCanvas = () => {
    const canvas = canvasRef.value;
    context.value.clearRect(0, 0, canvas.width, canvas.height);
};

</script>

<style scoped>
.drawing-canvas-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}
.toolbar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.5rem;
  background-color: #f1f3f4;
  border-bottom: 1px solid #ddd;
}
.tool-group {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
canvas {
  background-color: #fff;
  cursor: crosshair;
  flex-grow: 1;
}
</style>
