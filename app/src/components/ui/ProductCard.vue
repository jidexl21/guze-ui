<template>
  <div class="product-card" @click="$emit('view', product)">
    <!-- Image area -->
    <div class="product-image" :style="imageBg">
      <img v-if="product.imageUrl" :src="product.imageUrl" :alt="product.name" class="product-img" />
      <span v-else class="product-emoji">{{ categoryEmoji }}</span>

      <!-- Compliance strip -->
      <div class="compliance-strip">
        <span class="compliance-badge dcts" style="font-size:0.62rem;padding:2px 8px">✅ DCTS</span>
        <span v-if="product.complianceCategory?.includes('OPSS')" class="compliance-badge opss" style="font-size:0.62rem;padding:2px 8px">⚖️ OPSS</span>
        <span v-if="product.complianceCategory?.includes('FSA')"  class="compliance-badge fsa"  style="font-size:0.62rem;padding:2px 8px">🛡️ FSA</span>
      </div>

      <!-- Featured ribbon -->
      <div v-if="product.isFeatured" class="featured-ribbon">Featured</div>
    </div>

    <!-- Body -->
    <div class="product-body">
      <div class="product-category">{{ product.category }}</div>
      <div class="product-name">{{ product.name }}</div>
      <div class="product-supplier">
        By {{ product.supplier?.businessName ?? 'Unknown Supplier' }}
      </div>

      <!-- Price + stock -->
      <div class="product-price-row">
        <div class="product-price">
          £{{ formatPrice(product.price) }}
          <span class="product-unit">/ {{ product.unit || 'unit' }}</span>
        </div>
        <span :class="['badge', stockBadgeClass]">{{ stockLabel }}</span>
      </div>

      <!-- Rating -->
      <div v-if="product.averageRating" class="product-rating">
        <span class="stars">{{ starString }}</span>
        <span class="text-muted text-sm">({{ product.reviewCount ?? 0 }})</span>
      </div>

      <!-- Actions -->
      <div class="product-actions" @click.stop>
        <button class="btn btn-outline btn-sm" @click="$emit('view', product)">
          View
        </button>
        <button
          class="btn btn-primary btn-sm"
          :disabled="product.stockQuantity === 0 || addingToCart"
          @click="handleAddToCart"
        >
          <span v-if="addingToCart" class="spinner" style="width:12px;height:12px;" />
          <span v-else>+ Add</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useCartStore } from '@/stores/cart'

const props = defineProps({
  product: { type: Object, required: true }
})
const emit = defineEmits(['view', 'added'])

const cartStore     = useCartStore()
const addingToCart  = ref(false)

const categoryEmojiMap = {
  'cosmetics': '🧴', 'beauty': '🧴',
  'textiles': '🧵', 'fabric': '🧵',
  'food': '🌶️', 'spices': '🌶️',
  'handcraft': '🎨', 'art': '🎨',
  'health': '💊',
}
const categoryEmoji = computed(() => {
  const cat = (props.product.category ?? '').toLowerCase()
  return Object.entries(categoryEmojiMap).find(([k]) => cat.includes(k))?.[1] ?? '📦'
})

const imageBgColors = [
  'linear-gradient(135deg,#f5e6d0,#ede7da)',
  'linear-gradient(135deg,#fde8d8,#f5d0b8)',
  'linear-gradient(135deg,#e8f5e8,#d0ecd0)',
  'linear-gradient(135deg,#f0e8ff,#e0d0f0)',
  'linear-gradient(135deg,#fff3d8,#ffe8b0)',
  'linear-gradient(135deg,#fff0e8,#ffd8c0)',
]
const imageBg = computed(() => {
  if (props.product.imageUrl) return {}
  const idx = (props.product.name?.charCodeAt(0) ?? 0) % imageBgColors.length
  return { background: imageBgColors[idx] }
})

const stockLabel = computed(() => {
  const q = props.product.stockQuantity ?? 0
  if (q === 0)  return 'Out of Stock'
  if (q <= 10)  return 'Limited'
  return 'In Stock'
})
const stockBadgeClass = computed(() => {
  const q = props.product.stockQuantity ?? 0
  if (q === 0)  return 'badge-red'
  if (q <= 10)  return 'badge-amber'
  return 'badge-green'
})

const starString = computed(() => {
  const r   = Math.round(props.product.averageRating ?? 0)
  return '★'.repeat(r) + '☆'.repeat(5 - r)
})

const formatPrice = (p) => Number(p ?? 0).toFixed(2)

async function handleAddToCart() {
  addingToCart.value = true
  try {
    await cartStore.addItem(props.product.id, 1)
    emit('added', props.product)
  } finally {
    addingToCart.value = false
  }
}
</script>

<style scoped>
.product-card {
  background: var(--white);
  border-radius: var(--radius-lg);
  border: 1px solid var(--cream-dark);
  overflow: hidden;
  transition: all var(--transition);
  cursor: pointer;
}
.product-card:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-md);
  border-color: var(--green-light);
}
.product-image {
  height: 180px;
  display: flex; align-items: center; justify-content: center;
  position: relative; overflow: hidden;
}
.product-img { width: 100%; height: 100%; object-fit: cover; }
.product-emoji { font-size: 4rem; }
.compliance-strip {
  position: absolute; bottom: 8px; left: 8px; right: 8px;
  display: flex; gap: 4px; flex-wrap: wrap;
}
.featured-ribbon {
  position: absolute; top: 12px; right: -8px;
  background: var(--gold); color: var(--ink);
  font-size: 0.65rem; font-weight: 700; font-family: var(--font-mono);
  padding: 3px 16px 3px 10px;
  clip-path: polygon(0 0, 100% 0, 85% 50%, 100% 100%, 0 100%);
}
.product-body { padding: var(--space-md); }
.product-category {
  font-size: 0.68rem; font-weight: 700; font-family: var(--font-mono);
  text-transform: uppercase; letter-spacing: 0.08em; color: var(--muted); margin-bottom: 4px;
}
.product-name {
  font-family: var(--font-display); font-size: 1rem; font-weight: 600;
  color: var(--green-deep); margin-bottom: 4px; line-height: 1.3;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
}
.product-supplier { font-size: 0.75rem; color: var(--muted); margin-bottom: var(--space-sm); }
.product-price-row {
  display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px;
}
.product-price {
  font-family: var(--font-display); font-size: 1.1rem; font-weight: 700; color: var(--green-deep);
}
.product-unit { font-size: 0.72rem; color: var(--muted); font-family: var(--font-mono); }
.product-rating { font-size: 0.78rem; color: var(--gold); margin-bottom: var(--space-sm); display: flex; align-items: center; gap: 4px; }
.product-actions { display: flex; gap: 6px; }
.product-actions .btn { flex: 1; justify-content: center; }
</style>
