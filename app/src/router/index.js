import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const RetailerLayout    = () => import('@/layouts/RetailerLayout.vue')
const LoginView         = () => import('@/views/auth/LoginView.vue')
const RegisterView      = () => import('@/views/auth/RegisterView.vue')
const RetailerDashboard = () => import('@/views/retailer/DashboardView.vue')
const CatalogueView     = () => import('@/views/retailer/CatalogueView.vue')
const ProductDetailView = () => import('@/views/retailer/ProductDetailView.vue')
const CartView          = () => import('@/views/retailer/CartView.vue')
const CheckoutView      = () => import('@/views/retailer/CheckoutView.vue')
const OrdersView        = () => import('@/views/retailer/OrdersView.vue')
const OrderDetailView   = () => import('@/views/retailer/OrderDetailView.vue')
const SupplierDashboard  = () => import('@/views/supplier/DashboardView.vue')
const SupplierProducts   = () => import('@/views/supplier/ProductsView.vue')
const SupplierOrders     = () => import('@/views/supplier/OrdersView.vue')
const SupplierCompliance = () => import('@/views/supplier/ComplianceView.vue')
const SupplierInvoices   = () => import('@/views/supplier/InvoicesView.vue')
const AdminDashboard    = () => import('@/views/admin/DashboardView.vue')
const AdminSuppliers    = () => import('@/views/admin/SuppliersView.vue')
const AdminOrders       = () => import('@/views/admin/OrdersView.vue')
const AdminCompliance   = () => import('@/views/admin/ComplianceView.vue')

const UserRole = { Admin: 0, Retailer: 1, Supplier: 2 }

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login',    name: 'Login',    component: LoginView,    meta: { public: true } },
  { path: '/register', name: 'Register', component: RegisterView, meta: { public: true } },
  {
    path: '/retailer',
    component: RetailerLayout,
    meta: { requiresAuth: true, role: UserRole.Retailer },
    children: [
      { path: '',           redirect: '/retailer/dashboard' },
      { path: 'dashboard',  name: 'RetailerDashboard', component: RetailerDashboard },
      { path: 'catalogue',  name: 'Catalogue',         component: CatalogueView },
      { path: 'products/:id', name: 'ProductDetail',   component: ProductDetailView },
      { path: 'cart',       name: 'Cart',              component: CartView },
      { path: 'checkout',   name: 'Checkout',          component: CheckoutView },
      { path: 'orders',     name: 'Orders',            component: OrdersView },
      { path: 'orders/:id', name: 'OrderDetail',       component: OrderDetailView },
    ]
  },
  {
    path: '/supplier',
    meta: { requiresAuth: true, role: UserRole.Supplier },
    children: [
      { path: '',           redirect: '/supplier/dashboard' },
      { path: 'dashboard',  name: 'SupplierDashboard',  component: SupplierDashboard },
      { path: 'products',   name: 'SupplierProducts',   component: SupplierProducts },
      { path: 'orders',     name: 'SupplierOrders',     component: SupplierOrders },
      { path: 'compliance', name: 'SupplierCompliance', component: SupplierCompliance },
      { path: 'invoices',   name: 'SupplierInvoices',   component: SupplierInvoices },
    ]
  },
  {
    path: '/admin',
    meta: { requiresAuth: true, role: UserRole.Admin },
    children: [
      { path: '',           redirect: '/admin/dashboard' },
      { path: 'dashboard',  name: 'AdminDashboard',  component: AdminDashboard },
      { path: 'suppliers',  name: 'AdminSuppliers',  component: AdminSuppliers },
      { path: 'orders',     name: 'AdminOrders',     component: AdminOrders },
      { path: 'compliance', name: 'AdminCompliance', component: AdminCompliance },
    ]
  },
  { path: '/:pathMatch(.*)*', redirect: '/login' }
]

const router = createRouter({ history: createWebHistory(), routes })

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (to.meta.public) return true
  if (!auth.isAuthenticated) return { name: 'Login', query: { redirect: to.fullPath } }
  if (to.meta.role !== undefined && auth.user?.role !== to.meta.role) {
    const map = { 0: '/admin/dashboard', 1: '/retailer/dashboard', 2: '/supplier/dashboard' }
    return map[auth.user?.role] ?? '/login'
  }
  return true
})

export default router
