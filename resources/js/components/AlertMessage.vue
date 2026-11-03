<script setup>
defineProps({
  message: { type: String, default: '' },
  type: { type: String, default: 'success' },
});
</script>

<template>
  <div v-if="message" :class="['alert', type === 'error' ? 'alert-error' : 'alert-success']">
    {{ message }}
  </div>
</template>