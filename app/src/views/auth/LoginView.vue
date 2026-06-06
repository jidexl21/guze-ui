<template>
  <div class="auth-page">
    <div class="auth-card card">
      <div style="text-align:center;margin-bottom:var(--space-lg)">
        <h1 class="page-title" style="font-size:1.8rem">GUZE</h1>
        <p class="text-muted text-sm">Sign in to your account</p>
      </div>
      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label class="form-label">Email address</label>
          <input v-model="form.email" type="email" class="form-control" required />
        </div>
        <div class="form-group">
          <label class="form-label">Password</label>
          <input v-model="form.password" type="password" class="form-control" required />
        </div>
        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          <span v-if="loading" class="spinner" style="width:16px;height:16px" />
          <span v-else>Sign in</span>
        </button>
      </form>
      <p class="text-sm text-muted" style="text-align:center;margin-top:var(--space-md)">
        No account? <router-link :to="{name:'Register'}" style="color:var(--green-mid)">Create one</router-link>
      </p>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
const auth = useAuthStore(); const router = useRouter(); const route = useRoute()
const { loading, error } = storeToRefs(auth)
const form = ref({ email: '', password: '' })
const roleRedirect = { 0: '/admin/dashboard', 1: '/retailer/dashboard', 2: '/supplier/dashboard' }
async function handleLogin() {
  const user = await auth.login(form.value)
  router.push(route.query.redirect ?? roleRedirect[user.role] ?? '/login')
}
</script>
<style scoped>
.auth-page { min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--cream);padding:var(--space-md) }
.auth-card { width:100%;max-width:420px }
</style>
