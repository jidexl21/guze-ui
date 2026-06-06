import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as notifService from '@/services/notifications.service'

export const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref([])
  const totalCount    = ref(0)
  const loading       = ref(false)

  async function fetch(params = {}) {
    loading.value = true
    try {
      const res = await notifService.getNotifications({ page: 1, pageSize: 20, ...params })
      notifications.value = res.notifications; totalCount.value = res.totalCount
    } finally { loading.value = false }
  }

  return { notifications, totalCount, loading, fetch }
})
