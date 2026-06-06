// ── User Roles ────────────────────────────────────────────────────────────────
export const UserRole = { Admin: 0, Retailer: 1, Supplier: 2 }

// ── Order Status ──────────────────────────────────────────────────────────────
export const OrderStatus = { Pending: 0, Processing: 1, Shipped: 2, Delivered: 3, Cancelled: 4 }
export const ORDER_STATUS_LABELS  = { 0: 'Pending', 1: 'Processing', 2: 'Shipped', 3: 'Delivered', 4: 'Cancelled' }
export const ORDER_STATUS_BADGE   = { 0: 'badge-amber', 1: 'badge-blue', 2: 'badge-blue', 3: 'badge-green', 4: 'badge-red' }

// ── Payment Status ────────────────────────────────────────────────────────────
export const PaymentStatus = { Pending: 0, Paid: 1, Failed: 2, Refunded: 3 }
export const PAYMENT_STATUS_LABELS = { 0: 'Pending', 1: 'Paid', 2: 'Failed', 3: 'Refunded' }
export const PAYMENT_STATUS_BADGE  = { 0: 'badge-amber', 1: 'badge-green', 2: 'badge-red', 3: 'badge-blue' }

// ── Supplier Status ───────────────────────────────────────────────────────────
export const SupplierStatus = { Pending: 0, Approved: 1, Rejected: 2, Suspended: 3 }
export const SUPPLIER_STATUS_LABELS = { 0: 'Pending Review', 1: 'Approved', 2: 'Rejected', 3: 'Suspended' }
export const SUPPLIER_STATUS_BADGE  = { 0: 'badge-amber', 1: 'badge-green', 2: 'badge-red', 3: 'badge-red' }

// ── Compliance Status ─────────────────────────────────────────────────────────
export const ComplianceStatus = { Pending: 0, Approved: 1, Rejected: 2, ChangesRequested: 3 }
export const COMPLIANCE_STATUS_LABELS = { 0: 'Pending', 1: 'Approved', 2: 'Rejected', 3: 'Changes Requested' }
export const COMPLIANCE_STATUS_BADGE  = { 0: 'badge-amber', 1: 'badge-green', 2: 'badge-red', 3: 'badge-gold' }

// ── Document Types ────────────────────────────────────────────────────────────
export const DocumentType = { FSA: 0, OPSS: 1, DCTS: 2, UKRP: 3 }
export const DOCUMENT_TYPE_LABELS = { 0: 'FSA', 1: 'OPSS', 2: 'DCTS', 3: 'UKRP' }

// ── Product Status ────────────────────────────────────────────────────────────
export const ProductStatus = { Active: 0, Inactive: 1, OutOfStock: 2 }

// ── Sort options for catalogue ────────────────────────────────────────────────
export const SORT_OPTIONS = [
  { label: 'Newest',      sortBy: 'CreatedAt',  sortDirection: 'desc' },
  { label: 'Price ↑',    sortBy: 'Price',       sortDirection: 'asc'  },
  { label: 'Price ↓',    sortBy: 'Price',       sortDirection: 'desc' },
  { label: 'Top Rated',  sortBy: 'Rating',      sortDirection: 'desc' },
]
