<template>
  <RetailerLayout>
    <!-- Page header -->
    <div class="page-header">
      <div>
        <div class="page-title">Product Catalogue</div>
        <div class="page-subtitle">Browse DCTS duty-free, compliance-verified Nigerian goods</div>
      </div>
      <div class="flex items-center gap-sm">
        <span class="compliance-badge dcts">✅ DCTS Verified</span>
        <span class="compliance-badge opss">⚖️ OPSS Listed</span>
        <router-link to="/retailer/cart" class="btn btn-primary btn-sm">
          🛒 Cart <span v-if="cartCount > 0">({{ cartCount }})</span>
        </router-link>
      </div>
    </div>

    <!-- Add-to-cart toast -->
    <transition name="slide-down">
      <div v-if="toast" class="cart-toast">
        <span>🛒 <strong>{{ toast }}</strong> added to your order</span>
        <div class="flex gap-sm">
          <router-link to="/retailer/cart" class="btn btn-gold btn-sm">View Cart →</router-link>
          <button class="toast-close" @click="toast = null">✕</button>
        </div>
      </div>
    </transition>

    <div class="page-body">
      <div class="catalogue-layout">

        <!-- ── Filter sidebar ──────────────────────────────────────────── -->
        <aside class="filter-sidebar">
          <!-- Search -->
          <div style="margin-bottom: var(--space-md);">
            <input
              v-model="searchInput"
              type="text"
              class="form-control"
              placeholder="🔍 Search products..."
              @keyup.enter="applySearch"
            />
          </div>

          <!-- Category -->
          <div class="filter-section">
            <div class="filter-title">Category</div>
            <label class="filter-check">
              <input type="radio" v-model="selectedCategory" value="" />
              <span>All Categories</span>
            </label>
            <label v-for="cat in store.categories" :key="cat" class="filter-check">
              <input type="radio" v-model="selectedCategory" :value="cat" />
              <span>{{ cat }}</span>
            </label>
          </div>

          <!-- Price range -->
          <div class="filter-section">
            <div class="filter-title">Price (£)</div>
            <div class="flex gap-sm">
              <input v-model.number="minPrice" type="number" class="form-control" placeholder="Min" style="font-size:0.82rem" />
              <input v-model.number="maxPrice" type="number" class="form-control" placeholder="Max" style="font-size:0.82rem" />
            </div>
            <button class="btn btn-ghost btn-sm w-full" style="margin-top:8px" @click="applyPriceFilter">Apply</button>
          </div>

          <!-- Featured only -->
          <div class="filter-section">
            <label class="filter-check">
              <input type="checkbox" v-model="featuredOnly" @change="applyFeaturedFilter" />
              <span>⭐ Featured only</span>
            </label>
          </div>

          <!-- Reset -->
          <button class="btn btn-ghost btn-sm w-full" @click="resetAll">
            Reset Filters
          </button>
        </aside>

        <!-- ── Product area ─────────────────────────────────────────────── -->
        <div class="product-area">

          <!-- Toolbar -->
          <div class="catalogue-toolbar">
            <div class="catalogue-count">
              <template v-if="!store.loading">
                Showing <strong>{{ store.products.length }}</strong>
                of <strong>{{ store.totalCount }}</strong> products
              </template>
            </div>
            <select v-model="sortKey" class="form-control" style="font-size:0.82rem;width:auto;padding:8px 12px" @change="applySort">
              <option v-for="opt in SORT_OPTIONS" :key="opt.sortBy + opt.sortDirection" :value="opt.sortBy + '_' + opt.sortDirection">
                Sort: {{ opt.label }}
              </option>
            </select>
          </div>

          <!-- Loading -->
          <LoadingSpinner v-if="store.loading" label="Loading products…" />

          <!-- Error -->
          <div v-else-if="store.error" class="alert alert-error">{{ store.error }}</div>

          <!-- Empty -->
          <EmptyState
            v-else-if="!store.products.length"
            icon="🛍️"
            title="No products found"
            message="Try adjusting your filters or search term."
          >
            <button class="btn btn-outline btn-sm" style="margin-top: var(--space-md)" @click="resetAll">
              Clear Filters
            </button>
          </EmptyState>

          <!-- Grid -->
          <div v-else class="product-grid">
            <ProductCard
              v-for="product in store.products"
              :key="product.id"
              :product="product"
              @view="goToProduct"
              @added="showToast"
            />
          </div>

          <!-- Pagination -->
          <PaginationBar
            :page="store.filters.page"
            :total-pages="store.totalPages"
            @change="store.setPage"
          />
        </div>

      </div>
    </div>
  </RetailerLayout>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useProductsStore } from '@/stores/products'
import { useCartStore } from '@/stores/cart'
import { SORT_OPTIONS } from '@/constants'
import RetailerLayout from '@/layouts/RetailerLayout.vue'
import ProductCard    from '@/components/ui/ProductCard.vue'
import PaginationBar  from '@/components/ui/PaginationBar.vue'
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue'
import EmptyState     from '@/components/ui/EmptyState.vue'

const router    = useRouter()
const store     = useProductsStore()
const cartStore = useCartStore()
const { itemCount: cartCount } = storeToRefs(cartStore)

// ── Local filter state (committed on action) ──────────────────────────────
const searchInput     = ref(store.filters.searchTerm)
const selectedCategory = ref(store.filters.category)
const minPrice        = ref(store.filters.minPrice)
const maxPrice        = ref(store.filters.maxPrice)
const featuredOnly    = ref(store.filters.featuredOnly)
const sortKey         = ref(`${store.filters.sortBy}_${store.filters.sortDirection}`)
const toast           = ref(null)
let   toastTimer      = null

// ── Watch category for immediate apply ───────────────────────────────────
watch(selectedCategory, (val) => store.setFilter('category', val))

// ── Actions ───────────────────────────────────────────────────────────────
function applySearch() {
  store.setFilter('searchTerm', searchInput.value)
}

function applyPriceFilter() {
  store.fetchProducts({ minPrice: minPrice.value || null, maxPrice: maxPrice.value || null, page: 1 })
}

function applyFeaturedFilter() {
  store.setFilter('featuredOnly', featuredOnly.value)
}

function applySort() {
  const [sortBy, sortDirection] = sortKey.value.split('_')
  store.fetchProducts({ sortBy, sortDirection, page: 1 })
}

function resetAll() {
  searchInput.value      = ''
  selectedCategory.value = ''
  minPrice.value         = null
  maxPrice.value         = null
  featuredOnly.value     = false
  sortKey.value          = 'CreatedAt_desc'
  store.resetFilters()
}

function goToProduct(product) {
  router.push({ name: 'ProductDetail', params: { id: product.id } })
}

function showToast(product) {
  clearTimeout(toastTimer)
  toast.value = product.name
  toastTimer  = setTimeout(() => { toast.value = null }, 4000)
}

// ── Init ──────────────────────────────────────────────────────────────────
onMounted(async () => {
  await store.fetchCategories()
  if (!store.products.length) store.fetchProducts()
  if (!cartStore.cart) cartStore.fetchCart()
})
</script>

<style scoped>
.catalogue-layout { display: flex; gap: var(--space-xl); }

/* Filter sidebar */
.filter-sidebar { width: 240px; flex-shrink: 0; }
.filter-section {
  background: var(--white); border-radius: var(--radius-md);
  padding: var(--space-md); border: 1px solid var(--cream-dark);
  margin-bottom: var(--space-md);
}
.filter-title {
  font-size: 0.78rem; font-weight: 700; color: var(--green-deep);
  text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: var(--space-sm);
}
.filter-check {
  display: flex; align-items: center; gap: 8px;
  margin-bottom: 8px; cursor: pointer; font-size: 0.85rem; color: var(--ink-mid);
}
.filter-check input { accent-color: var(--green-bright); }

/* Product area */
.product-area { flex: 1; min-width: 0; }
.catalogue-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: var(--space-lg); gap: var(--space-md); flex-wrap: wrap;
}
.catalogue-count { font-size: 0.88rem; color: var(--muted); }
.catalogue-count strong { color: var(--green-deep); }

.product-grid {
  display: grid; grid-template-columns: repeat(3, 1fr); gap: var(--space-md);
}

/* Cart toast */
.cart-toast {
  background: var(--green-deep); color: white;
  padding: 12px 20px; border-radius: var(--radius-md);
  margin-bottom: var(--space-md);
  display: flex; align-items: center; justify-content: space-between; gap: var(--space-md);
  font-size: 0.88rem;
}
.toast-close {
  background: none; border: none; color: rgba(255,255,255,0.6);
  cursor: pointer; font-size: 1rem; padding: 0 4px;
}

/* Transition */
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from, .slide-down-leave-to { opacity: 0; transform: translateY(-10px); }

@media (max-width: 900px) {
  .catalogue-layout { flex-direction: column; }
  .filter-sidebar { width: 100%; }
  .product-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 480px) {
  .product-grid { grid-template-columns: 1fr; }
}
</style>
