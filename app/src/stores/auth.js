import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as authService from '@/services/auth.service'

export const useAuthStore = defineStore('auth', () => {
  const user         = ref(JSON.parse(localStorage.getItem('guze_user') ?? 'null'))
  const accessToken  = ref(localStorage.getItem('guze_token') ?? null)
  const refreshToken = ref(localStorage.getItem('guze_refresh') ?? null)
  const loading      = ref(false)
  const error        = ref(null)

  const isAuthenticated = computed(() => !!accessToken.value && !!user.value)
  const isAdmin    = computed(() => user.value?.role === 0)
  const isRetailer = computed(() => user.value?.role === 1)
  const isSupplier = computed(() => user.value?.role === 2)

  function _persist(data) {
    accessToken.value  = data.accessToken
    refreshToken.value = data.refreshToken
    user.value         = data.user
    localStorage.setItem('guze_token',   data.accessToken)
    localStorage.setItem('guze_refresh', data.refreshToken)
    localStorage.setItem('guze_user',    JSON.stringify(data.user))
  }
  function _clear() {
    accessToken.value = null; refreshToken.value = null; user.value = null
    localStorage.removeItem('guze_token')
    localStorage.removeItem('guze_refresh')
    localStorage.removeItem('guze_user')
  }

  async function login(credentials) {
    loading.value = true; error.value = null
    try {
      const res = await authService.login(credentials)
      _persist(res.data); return res.data.user
    } catch (e) {
      error.value = e.response?.data?.message ?? 'Login failed'; throw e
    } finally { loading.value = false }
  }

  async function register(payload) {
    loading.value = true; error.value = null
    try {
      const res = await authService.register(payload)
      _persist(res.data); return res.data.user
    } catch (e) {
      error.value = e.response?.data?.message ?? 'Registration failed'; throw e
    } finally { loading.value = false }
  }

  async function logout() {
    try { await authService.logout() } catch {}
    _clear()
  }

  async function refresh() {
    if (!refreshToken.value) throw new Error('No refresh token')
    const res = await authService.refresh({ refreshToken: refreshToken.value })
    _persist(res.data); return res.data.accessToken
  }

  return { user, accessToken, refreshToken, loading, error, isAuthenticated, isAdmin, isRetailer, isSupplier, login, register, logout, refresh }
})
