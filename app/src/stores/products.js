import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import * as productsService from '@/services/products.service'

export const useProductsStore = defineStore('products', () => {
  // ── Catalogue state ───────────────────────────────────────────────────────
  const products    = ref([])
  const totalCount  = ref(0)
  const totalPages  = ref(0)
  const categories  = ref([])
  const featured    = ref([])
  const loading     = ref(false)
  const error       = ref(null)

  // ── Active filters ────────────────────────────────────────────────────────
  const filters = reactive({
    searchTerm:    '',
    category:      '',
    minPrice:      null,
    maxPrice:      null,
    featuredOnly:  false,
    sortBy:        'CreatedAt',
    sortDirection: 'desc',
    page:          1,
    pageSize:      12,
  })

  // ── Single product ────────────────────────────────────────────────────────
  const currentProduct = ref(null)
  const productLoading = ref(false)

  // ── Actions ───────────────────────────────────────────────────────────────
  async function fetchProducts(overrides = {}) {
    loading.value = true
    error.value   = null
    Object.assign(filters, overrides)
    try {
      const params = { ...filters }
      // strip empty/null values
      Object.keys(params).forEach(k => (params[k] === '' || params[k] === null) && delete params[k])
      const res       = await productsService.getProducts(params)
      products.value  = res.products ?? []
      totalCount.value = res.totalCount ?? 0
      totalPages.value = res.totalPages ?? 0
    } catch (e) {
      error.value = e.response?.data?.title ?? 'Failed to load products'
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id) {
    productLoading.value = true
    error.value          = null
    try {
      currentProduct.value = await productsService.getProduct(id)
    } catch (e) {
      error.value = e.response?.data?.title ?? 'Product not found'
    } finally {
      productLoading.value = false
    }
  }

  async function fetchCategories() {
    if (categories.value.length) return
    categories.value = await productsService.getCategories()
  }

  async function fetchFeatured(pageSize = 8) {
    featured.value = await productsService.getFeatured(pageSize)
  }

  function setPage(page) {
    fetchProducts({ page })
  }

  function setFilter(key, value) {
    fetchProducts({ [key]: value, page: 1 })
  }

  function resetFilters() {
    fetchProducts({
      searchTerm: '', category: '', minPrice: null, maxPrice: null,
      featuredOnly: false, sortBy: 'CreatedAt', sortDirection: 'desc', page: 1,
    })
  }

  return {
    products, totalCount, totalPages, categories, featured,
    loading, error, filters,
    currentProduct, productLoading,
    fetchProducts, fetchProduct, fetchCategories, fetchFeatured,
    setPage, setFilter, resetFilters,
  }
})
