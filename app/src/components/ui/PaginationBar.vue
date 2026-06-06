<template>
  <div v-if="totalPages > 1" class="pagination">
    <button
      class="btn btn-ghost btn-sm"
      :disabled="page <= 1"
      @click="$emit('change', page - 1)"
    >← Prev</button>

    <div class="page-numbers">
      <button
        v-for="p in visiblePages"
        :key="p"
        :class="['page-btn', { active: p === page }]"
        @click="p !== '...' && $emit('change', p)"
      >{{ p }}</button>
    </div>

    <button
      class="btn btn-ghost btn-sm"
      :disabled="page >= totalPages"
      @click="$emit('change', page + 1)"
    >Next →</button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  page:       { type: Number, required: true },
  totalPages: { type: Number, required: true },
})
defineEmits(['change'])

const visiblePages = computed(() => {
  const { page, totalPages } = props
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
  const pages = []
  if (page <= 4) {
    pages.push(1, 2, 3, 4, 5, '...', totalPages)
  } else if (page >= totalPages - 3) {
    pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
  } else {
    pages.push(1, '...', page - 1, page, page + 1, '...', totalPages)
  }
  return pages
})
</script>

<style scoped>
.pagination {
  display: flex; align-items: center; justify-content: center;
  gap: var(--space-sm); margin-top: var(--space-xl);
}
.page-numbers { display: flex; gap: 4px; }
.page-btn {
  width: 36px; height: 36px;
  border-radius: var(--radius-sm);
  border: 1.5px solid var(--cream-dark);
  background: var(--white); color: var(--ink-mid);
  font-size: 0.85rem; font-weight: 500;
  cursor: pointer; transition: all var(--transition);
  display: flex; align-items: center; justify-content: center;
}
.page-btn:hover { border-color: var(--green-bright); color: var(--green-mid); }
.page-btn.active {
  background: var(--green-deep); color: var(--white);
  border-color: var(--green-deep); font-weight: 700;
}
</style>
