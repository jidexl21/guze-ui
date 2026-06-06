import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as cartService from '@/services/cart.service'

export const useCartStore = defineStore('cart', () => {
  const cart    = ref(null)
  const loading = ref(false)
  const error   = ref(null)

  const itemCount = computed(() => cart.value?.totalItems ?? 0)
  const subTotal  = computed(() => cart.value?.subTotal ?? 0)
  const items     = computed(() => cart.value?.items ?? [])

  async function fetchCart()                    { loading.value = true; try { cart.value = await cartService.getCart() } finally { loading.value = false } }
  async function addItem(productId, quantity)   { cart.value = await cartService.addItem({ productId, quantity }) }
  async function updateItem(id, quantity)       { cart.value = await cartService.updateItem(id, { quantity }) }
  async function removeItem(id)                 { cart.value = await cartService.removeItem(id) }
  async function clearCart()                    { await cartService.clearCart(); cart.value = null }

  return { cart, loading, error, itemCount, subTotal, items, fetchCart, addItem, updateItem, removeItem, clearCart }
})
