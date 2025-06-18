<template>
  <div class="loading-container">
    <div class="loading-spinner">
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-ring"></div>
      <div class="spinner-text">{{ text || 'Chargement...' }}</div>
    </div>
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
  justify-content: center;
  align-items: center;
  min-height: 200px;
  width: 100%;
}

.loading-spinner {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.spinner-ring {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 4px solid transparent;
  border-top: 4px solid #9b1c1c;
  border-radius: 50%;
  animation: spin 1.2s linear infinite;
}

.spinner-ring:nth-child(2) {
  width: 50px;
  height: 50px;
  border-top-color: #bea6a1;
  animation-delay: -0.4s;
}

.spinner-ring:nth-child(3) {
  width: 40px;
  height: 40px;
  border-top-color: #275b00;
  animation-delay: -0.8s;
}

.spinner-text {
  margin-top: 80px;
  font-size: 1rem;
  color: #9b1c1c;
  font-weight: 500;
  animation: pulse 2s ease-in-out infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

/* Variante pour les petits spinners */
.loading-spinner.small .spinner-ring {
  width: 30px;
  height: 30px;
  border-width: 3px;
}

.loading-spinner.small .spinner-ring:nth-child(2) {
  width: 25px;
  height: 25px;
  border-width: 3px;
}

.loading-spinner.small .spinner-ring:nth-child(3) {
  width: 20px;
  height: 20px;
  border-width: 3px;
}

.loading-spinner.small .spinner-text {
  margin-top: 40px;
  font-size: 0.875rem;
}

/* Variante pour les spinners inline */
.loading-spinner.inline {
  flex-direction: row;
  gap: 0.5rem;
}

.loading-spinner.inline .spinner-ring {
  position: static;
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.loading-spinner.inline .spinner-ring:nth-child(2) {
  width: 16px;
  height: 16px;
  border-width: 2px;
}

.loading-spinner.inline .spinner-ring:nth-child(3) {
  width: 12px;
  height: 12px;
  border-width: 2px;
}

.loading-spinner.inline .spinner-text {
  margin-top: 0;
  font-size: 0.875rem;
}
</style> 