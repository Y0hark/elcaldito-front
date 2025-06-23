<template>
  <div class="loading-container">
    <div class="loading-dots">
      <span class="dot"></span>
      <span class="dot"></span>
      <span class="dot"></span>
    </div>
    <div class="spinner-text">{{ text || 'Chargement...' }}</div>
  </div>
</template>

<script setup>
defineProps({
  text: {
    type: String,
    default: 'Chargement...'
  }
})
</script>

<style scoped>
.loading-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 120px;
  width: 100%;
}

.loading-dots {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
}

.dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff8ed;
  opacity: 0.7;
  animation: bounce 1.2s infinite both;
}
.dot:nth-child(2) {
  animation-delay: 0.2s;
}
.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.8); opacity: 0.7; }
  40% { transform: scale(1.2); opacity: 1; }
}

.spinner-text {
  font-size: 1rem;
  color: #fff8ed;
  font-weight: 500;
  text-align: center;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1; }
}
</style> 