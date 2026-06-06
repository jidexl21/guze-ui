<template>
  <div class="auth-page">
    <div class="auth-card card">
      <div style="text-align:center;margin-bottom:var(--space-lg)">
        <h1 class="page-title" style="font-size:1.8rem">Join GUZE</h1>
        <p class="text-muted text-sm">Create your account</p>
      </div>
      <div v-if="error" class="alert alert-error">{{ error }}</div>
      <div class="tabs" style="margin-bottom:var(--space-lg)">
        <button class="tab-btn" :class="{active:form.role===1}" type="button" @click="form.role=1">UK Retailer</button>
        <button class="tab-btn" :class="{active:form.role===2}" type="button" @click="form.role=2">Nigerian Supplier</button>
      </div>
      <form @submit.prevent="handleRegister">
        <div class="grid-2" style="gap:var(--space-sm)">
          <div class="form-group"><label class="form-label">First name</label><input v-model="form.firstName" type="text" class="form-control" required /></div>
          <div class="form-group"><label class="form-label">Last name</label><input v-model="form.lastName" type="text" class="form-control" required /></div>
        </div>
        <div class="form-group"><label class="form-label">Email</label><input v-model="form.email" type="email" class="form-control" required /></div>
        <div class="form-group"><label class="form-label">Password</label><input v-model="form.password" type="password" class="form-control" required /></div>
        <div class="form-group"><label class="form-label">Phone</label><input v-model="form.phoneNumber" type="tel" class="form-control" /></div>
        <template v-if="form.role===2">
          <div class="form-group"><label class="form-label">Business name</label><input v-model="form.businessName" type="text" class="form-control" required /></div>
          <div class="form-group"><label class="form-label">Registration number</label><input v-model="form.businessRegistrationNumber" type="text" class="form-control" /></div>
          <div class="form-group"><label class="form-label">Country code</label><input v-model="form.countryCode" type="text" class="form-control" placeholder="NG" maxlength="2" /></div>
        </template>
        <button type="submit" class="btn btn-primary w-full" :disabled="loading">
          <span v-if="loading" class="spinner" style="width:16px;height:16px" />
          <span v-else>Create account</span>
        </button>
      </form>
      <p class="text-sm text-muted" style="text-align:center;margin-top:var(--space-md)">
        Have an account? <router-link :to="{name:'Login'}" style="color:var(--green-mid)">Sign in</router-link>
      </p>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { storeToRefs } from 'pinia'
const auth = useAuthStore(); const router = useRouter()
const { loading, error } = storeToRefs(auth)
const form = ref({ firstName:'',lastName:'',email:'',password:'',phoneNumber:'',role:1,businessName:'',businessRegistrationNumber:'',countryCode:'NG' })
async function handleRegister() {
  const user = await auth.register(form.value)
  router.push({ 1:'/retailer/dashboard', 2:'/supplier/dashboard' }[user.role] ?? '/login')
}
</script>
<style scoped>
.auth-page { min-height:100vh;display:flex;align-items:center;justify-content:center;background:var(--cream);padding:var(--space-md) }
.auth-card { width:100%;max-width:480px }
</style>
