import http from './http'
const BASE = '/api/v1/Admin'
export const getDashboard    = ()             => http.get(`${BASE}/dashboard`).then(r => r.data)
export const getSuppliers    = (p={})         => http.get(`${BASE}/suppliers`, { params: p }).then(r => r.data)
export const getSupplier     = (id)           => http.get(`${BASE}/suppliers/${id}`).then(r => r.data)
export const approveSupplier = (id, p)        => http.patch(`${BASE}/suppliers/${id}/approval`, p).then(r => r.data)
export const getOrders       = (p={})         => http.get(`${BASE}/orders`, { params: p }).then(r => r.data)
export const updateOrderStatus = (id, p)      => http.patch(`${BASE}/orders/${id}/status`, p).then(r => r.data)
