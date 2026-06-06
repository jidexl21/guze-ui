<template>
  <RetailerLayout>
    <!-- Loading -->
    <LoadingSpinner v-if="store.productLoading" label="Loading product…" height="60vh" />

    <!-- Error -->
    <div v-else-if="store.error" class="page-body">
      <div class="alert alert-error">{{ store.error }}</div>
      <button class="btn btn-outline btn-sm" style="margin-top: var(--space-md)" @click="router.back()">← Back</button>
    </div>

    <!-- Product -->
    <template v-else-if="product">
      <!-- Header -->
      <div class="page-header">
        <div class="flex items-center gap-md">
          <button class="btn btn-ghost btn-sm" @click="router.back()">← Back</button>
          <div>
            <div class="page-title" style="font-size:1.3rem;">{{ product.name }}</div>
            <div class="page-subtitle">{{ product.category }} · SKU: {{ product.sku }}</div>
          </div>
        </div>
        <router-link to="/retailer/cart" class="btn btn-primary btn-sm">
          🛒 Cart <span v-if="cartCount > 0">({{ cartCount }})</span>
        </router-link>
      </div>

      <div class="page-body">
        <div class="detail-layout">

          <!-- ── Left: image + supplier ───────────────────────────────── -->
          <div class="detail-left">
            <div class="detail-image-wrap">
              <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" class="detail-img" />
              <div v-else class="detail-image-placeholder">{{ categoryEmoji }}</div>
            </div>

            <!-- Supplier card -->
            <div class="card" style="margin-top: var(--space-md);">
              <div class="section-heading" style="font-size:0.9rem; margin-bottom: var(--space-sm);">Supplier</div>
              <div style="font-weight:600; color: var(--green-deep); margin-bottom: 4px;">
                {{ product.supplier?.businessName }}
              </div>
              <div class="text-muted text-sm" style="margin-bottom: var(--space-sm);">
                {{ product.supplier?.country }}
              </div>
              <div class="flex gap-sm" style="flex-wrap:wrap;">
                <div class="supplier-stat">
                  <div class="supplier-stat-val">{{ product.supplier?.averageRating?.toFixed(1) ?? '—' }}</div>
                  <div class="supplier-stat-label">Rating</div>
                </div>
                <div class="supplier-stat">
                  <div class="supplier-stat-val">{{ product.supplier?.completedOrders ?? '—' }}</div>
                  <div class="supplier-stat-label">Orders</div>
                </div>
                <div class="supplier-stat">
                  <div class="supplier-stat-val">{{ onTimeRate }}</div>
                  <div class="supplier-stat-label">On-time</div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Right: details ────────────────────────────────────────── -->
          <div class="detail-right">
            <!-- Compliance badges -->
            <div class="flex gap-sm" style="flex-wrap:wrap; margin-bottom: var(--space-lg);">
              <span class="compliance-badge dcts">✅ DCTS Duty Free</span>
              <span v-if="product.complianceCategory?.includes('OPSS')" class="compliance-badge opss">⚖️ OPSS Registered</span>
              <span v-if="product.complianceCategory?.includes('FSA')"  class="compliance-badge fsa">🛡️ FSA Compliant</span>
            </div>

            <!-- Price -->
            <div class="price-block">
              <span class="detail-price">£{{ formatPrice(product.price) }}</span>
              <span class="detail-unit">/ {{ product.unit || 'unit' }}</span>
              <span :class="['badge', stockBadgeClass]" style="margin-left:auto;">{{ stockLabel }}</span>
            </div>

            <!-- Rating -->
            <div v-if="product.averageRating" class="flex items-center gap-sm" style="margin-bottom:var(--space-md);">
              <span style="color:var(--gold); font-size:1rem;">{{ starString }}</span>
              <span class="text-muted text-sm">{{ product.averageRating?.toFixed(1) }} ({{ product.reviewCount }} reviews)</span>
            </div>

            <!-- Description -->
            <p v-if="product.description" class="detail-description">
              {{ product.description }}
            </p>

            <!-- Spec grid -->
            <div class="detail-grid">
              <div class="detail-chip">
                <strong>HS Code</strong>{{ product.hsCode || '—' }}
              </div>
              <div class="detail-chip">
                <strong>Origin</strong>{{ product.countryOfOrigin || '—' }}
              </div>
              <div class="detail-chip">
                <strong>Lead Time</strong>{{ product.leadTimeDays ? `${product.leadTimeDays} days` : '—' }}
              </div>
              <div class="detail-chip">
                <strong>Weight</strong>{{ product.weightPerUnit ? `${product.weightPerUnit} kg` : '—' }}
              </div>
              <div class="detail-chip">
                <strong>Dimensions</strong>{{ product.dimensions || '—' }}
              </div>
              <div class="detail-chip">
                <strong>Stock</strong>{{ product.stockQuantity }} {{ product.unit }}
              </div>
              <div class="detail-chip">
                <strong>DCTS Rate</strong>0% (duty-free)
              </div>
              <div class="detail-chip">
                <strong>Compliance</strong>{{ product.complianceCategory || '—' }}
              </div>
            </div>

            <!-- Add to cart -->
            <div class="add-cart-bar">
              <div class="qty-control">
                <button @click="qty > 1 && qty--">−</button>
                <span class="font-mono">{{ qty }} {{ product.unit || 'units' }}</span>
                <button @click="qty++">+</button>
              </div>
              <button
                class="btn btn-primary"
                :disabled="product.stockQuantity === 0 || adding"
                @click="addToCart"
              >
                <span v-if="adding" class="spinner" style="width:16px;height:16px;" />
                <span v-else>+ Add to Order</span>
              </button>
            </div>

            <!-- Success flash -->
            <transition name="fade">
              <div v-if="addedSuccess" class="alert alert-success" style="margin-top:var(--space-sm);">
                ✅ Added {{ qty }} {{ product.unit || 'unit(s)' }} to your order!
              </div>
            </transition>
          </div>
        </div>
      </div>
    </template>
  </RetailerLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import RetailerLayout from '@/layouts/RetailerLayout.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'

const route     = useRoute()
const router    = useRouter()
const store     = useProductsStore()
const cartStore = useCartStore()
const { itemCount: cartCount } = storeToRefs(cartStore)

const product = computed(() => store.currentProduct)
const qty     = ref(1)
const adding  = ref(false)
const addedSuccess = ref(false)

// ── Computed helpers ──────────────────────────────────────────────────────
const categoryEmojiMap = {
  cosmetics: '🧴', beauty: '🧴', textiles: '🧵', fabric: '🧵',
  food: '🌶️', spices: '🌶️', handcraft: '🎨', art: '🎨',
}
const categoryEmoji = computed(() => {
  const cat = (product.value?.category ?? '').toLowerCase()
  return Object.entries(categoryEmojiMap).find(([k]) => cat.includes(k))?.[1] ?? '📦'
})

const stockLabel = computed(() => {
  const q = product.value?.stockQuantity ?? 0
  return q === 0 ? 'Out of Stock' : q <= 10 ? 'Limited' : 'In Stock'
})
const stockBadgeClass = computed(() => {
  const q = product.value?.stockQuantity ?? 0
  return q === 0 ? 'badge-red' : q <= 10 ? 'badge-amber' : 'badge-green'
})
const starString = computed(() => {
  const r = Math.round(product.value?.averageRating ?? 0)
  return '★'.repeat(r) + '☆'.repeat(5 - r)
})
const onTimeRate = computed(() => {
  const r = product.value?.supplier?.onTimeDeliveryRate
  return r != null ? `${Math.round(r * 100)}%` : '—'
})
const formatPrice = (p) => Number(p ?? 0).toFixed(2)

// ── Add to cart ───────────────────────────────────────────────────────────
async function addToCart() {
  adding.value = true
  try {
    await cartStore.addItem(product.value.id, qty.value)
    addedSuccess.value = true
    setTimeout(() => { addedSuccess.value = false }, 3000)
  } finally {
    adding.value = false
  }
}

// ── Init ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  await store.fetchProduct(route.params.id)
  if (!cartStore.cart) cartStore.fetchCart()
})
</script>

<style scoped>
.detail-layout {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--space-xl);
  align-items: start;
}
.detail-image-wrap {
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--cream-dark);
  aspect-ratio: 1;
  background: var(--cream);
  display: flex; align-items: center; justify-content: center;
}
.detail-img { width: 100%; height: 100%; object-fit: cover; }
.detail-image-placeholder { font-size: 6rem; }

.supplier-stat {
  flex: 1; text-align: center;
  background: var(--cream); border-radius: var(--radius-sm); padding: 8px;
}
.supplier-stat-val { font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--green-deep); }
.supplier-stat-label { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }

.price-block {
  display: flex; align-items: baseline; gap: 8px;
  margin-bottom: var(--space-md);
}
.detail-price { font-family: var(--font-display); font-size: 2rem; font-weight: 700; color: var(--green-deep); }
.detail-unit  { font-size: 0.9rem; color: var(--muted); font-family: var(--font-mono); }
.detail-description { font-size: 0.9rem; color: var(--ink-mid); line-height: 1.7; margin-bottom: var(--space-lg); }

.detail-grid {
  display: grid; grid-template-columns: 1fr 1fr;
  gap: var(--space-sm); margin-bottom: var(--space-xl);
}
.detail-chip {
  background: var(--cream); border-radius: var(--radius-sm);
  padding: 10px 14px; font-size: 0.85rem; color: var(--ink-mid);
}
.detail-chip strong {
  display: block; font-size: 0.7rem; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 2px;
}

.add-cart-bar {
  display: flex; align-items: center; gap: var(--space-md);
  padding: var(--space-md);
  background: var(--cream); border-radius: var(--radius-md);
  border: 1px solid var(--cream-dark);
}
.qty-control {
  display: flex; align-items: center; gap: 8px;
  border: 1.5px solid var(--cream-dark); border-radius: var(--radius-full);
  padding: 4px 8px; background: var(--white);
}
.qty-control button {
  background: none; border: none; font-size: 1.1rem;
  cursor: pointer; color: var(--green-mid); width: 28px; text-align: center;
}
.qty-control span { font-weight: 600; min-width: 60px; text-align: center; }

.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@media (max-width: 768px) {
  .detail-layout { grid-template-columns: 1fr; }
}
</style>
