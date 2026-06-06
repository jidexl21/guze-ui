<template>
  <aside class="sidebar" :class="{ open: modelValue }">
    <!-- Logo -->
    <div class="sidebar-logo">
      <router-link to="/retailer/dashboard">
        <span class="logo-flag">🇳🇬→🇬🇧</span>
        GUZE
      </router-link>
    </div>

    <!-- Nav -->
    <nav class="sidebar-nav">
      <div class="sidebar-section-label">Retailer Portal</div>

      <router-link to="/retailer/dashboard" class="sidebar-link" active-class="active">
        <span class="icon">📊</span> Dashboard
      </router-link>
      <router-link to="/retailer/catalogue" class="sidebar-link" active-class="active">
        <span class="icon">🛍️</span> Product Catalogue
      </router-link>
      <router-link to="/retailer/cart" class="sidebar-link" active-class="active">
        <span class="icon">🛒</span>
        Cart
        <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
      </router-link>
      <router-link to="/retailer/orders" class="sidebar-link" active-class="active">
        <span class="icon">📦</span> My Orders
      </router-link>

      <div class="sidebar-section-label">Account</div>
      <a href="#" class="sidebar-link">
        <span class="icon">⚙️</span> Settings
      </a>
    </nav>

    <!-- Footer -->
    <div class="sidebar-footer">
      <div class="flex items-center gap-sm" style="margin-bottom: 12px;">
        <div class="user-avatar">{{ initials }}</div>
        <div>
          <div style="font-size: 0.82rem; color: white; font-weight: 600;">
            {{ user?.firstName }} {{ user?.lastName }}
          </div>
          <div style="font-size: 0.7rem; color: rgba(255,255,255,0.4);">UK Retailer</div>
        </div>
      </div>
      <button class="sidebar-link" style="width:100%; background:none; border:none; cursor:pointer; text-align:left;" @click="$emit('logout')">
        <span class="icon">↩️</span> Sign Out
      </button>
    </div>
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { storeToRefs } from 'pinia'

defineProps({ modelValue: Boolean })
defineEmits(['update:modelValue', 'logout'])

const { user }    = storeToRefs(useAuthStore())
const { itemCount: cartCount } = storeToRefs(useCartStore())

const initials = computed(() => {
  const f = user.value?.firstName?.[0] ?? ''
  const l = user.value?.lastName?.[0] ?? ''
  return (f + l).toUpperCase() || 'U'
})
</script>

<style scoped>
.cart-badge {
  margin-left: auto;
  background: var(--gold);
  color: var(--ink);
  font-size: 0.65rem;
  font-weight: 700;
  font-family: var(--font-mono);
  padding: 2px 7px;
  border-radius: var(--radius-full);
  min-width: 20px;
  text-align: center;
}
.user-avatar {
  width: 34px; height: 34px;
  border-radius: 50%;
  background: var(--green-mid);
  display: flex; align-items: center; justify-content: center;
  font-size: 0.82rem; color: white; font-weight: 700;
  flex-shrink: 0;
}
</style>
