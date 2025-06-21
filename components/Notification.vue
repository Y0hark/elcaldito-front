<template>
  <transition name="notification-fade">
    <div
      v-if="visible"
      :class="notificationClasses"
      class="fixed top-24 right-5 w-full max-w-sm p-4 rounded-lg shadow-lg text-white z-[100] flex items-center"
    >
      <div class="flex-shrink-0">
        <svg v-if="type === 'success'" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
        </svg>
        <svg v-if="type === 'error'" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
      </div>
      <div class="ml-3">
        <p class="text-sm font-medium">{{ message }}</p>
      </div>
      <button @click="$emit('close')" class="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-full inline-flex items-center justify-center">
        <span class="sr-only">Close</span>
        <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: String,
  type: {
    type: String,
    default: 'success'
  },
  visible: Boolean
})

defineEmits(['close'])

const notificationClasses = computed(() => ({
  'bg-green-600': props.type === 'success',
  'bg-red-600': props.type === 'error',
  'hover:bg-green-700': props.type === 'success',
  'hover:bg-red-700': props.type === 'error'
}))
</script>

<style scoped>
.notification-fade-enter-active,
.notification-fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.notification-fade-enter-from,
.notification-fade-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style> 