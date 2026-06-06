<template>
  <div class="spinner-wrap" :style="{ minHeight: height }">
    <div class="spinner" :style="{ width: size, height: size }" />
    <p v-if="label" class="spinner-label">{{ label }}</p>
  </div>
</template>

<script setup>
defineProps({
  size:   { type: String, default: '36px' },
  height: { type: String, default: '200px' },
  label:  { type: String, default: '' },
})
</script>

<style scoped>
.spinner-wrap {
  display: flex; flex-direction: column;
  align-items: center; justify-content: center; gap: 12px;
}
.spinner-label { font-size: 0.85rem; color: var(--muted); }
</style>
