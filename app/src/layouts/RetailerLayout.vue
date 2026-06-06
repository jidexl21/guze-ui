<template>
  <AppLayout>
    <template #sidebar="{ sidebarOpen }">
      <RetailerSidebar
        :model-value="sidebarOpen"
        @logout="handleLogout"
      />
    </template>
  </AppLayout>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppLayout from './AppLayout.vue'
import RetailerSidebar from '@/components/layout/RetailerSidebar.vue'

const router = useRouter()
const auth   = useAuthStore()

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'Login' })
}
</script>
