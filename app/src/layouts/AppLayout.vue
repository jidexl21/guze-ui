<template>
  <div class="app-layout">
    <!-- Sidebar slot — each portal injects its own sidebar -->
    <slot name="sidebar" :sidebarOpen="sidebarOpen" :closeSidebar="() => sidebarOpen = false" />

    <!-- Overlay for mobile -->
    <div
      v-if="sidebarOpen"
      class="sidebar-overlay"
      @click="sidebarOpen = false"
    />

    <!-- Main content -->
    <main class="main-content">
      <!-- Mobile top bar -->
      <div class="mobile-bar">
        <button class="btn btn-ghost btn-sm" @click="sidebarOpen = true">☰</button>
        <span style="font-family: var(--font-display); font-weight: 700; color: var(--green-deep);">GUZE</span>
        <div style="width: 36px;" />
      </div>

      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const sidebarOpen = ref(false)
</script>

<style scoped>
.sidebar-overlay {
  display: none;
  position: fixed; inset: 0;
  background: rgba(10,56,40,0.4);
  z-index: 40;
}
.mobile-bar {
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 12px var(--space-md);
  background: var(--white);
  border-bottom: 1px solid var(--cream-dark);
  position: sticky; top: 0; z-index: 30;
}
@media (max-width: 768px) {
  .sidebar-overlay { display: block; }
  .mobile-bar { display: flex; }
}
</style>
