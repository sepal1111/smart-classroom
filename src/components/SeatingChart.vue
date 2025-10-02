<!-- File: /src/components/SeatingChart.vue -->
<template>
  <div class="seating-chart-container">
    <h2>座位表</h2>
    <!-- 座位表邏輯將會在這裡實現 -->
    <div class="chart-grid">
      <p>這裡是座位表的核心元件，將會包含所有學生的卡片以及拖曳功能。</p>
    </div>
  </div>
</template>

<script setup>
// 這裡是元件的 JavaScript 邏輯
// 將會處理拖曳、儲存座位表等複雜互動
</script>

<style scoped>
/* 這裡是此元件專屬的 CSS 樣式 */
.seating-chart-container {
  padding: 1rem;
}
.chart-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 假設為 5 行 */
  gap: 1rem;
  margin-top: 1rem;
}
</style>
