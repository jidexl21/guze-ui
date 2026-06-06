import http from './http'
const BASE = '/api/v1/Checkout'
export const previewCheckout = (p)   => http.post(`${BASE}/preview`, p).then(r => r.data)
export const placeOrder      = (p)   => http.post(`${BASE}/place-order`, p).then(r => r.data)
export const getOrders       = (p={})=> http.get(`${BASE}/orders`, { params: p }).then(r => r.data)
export const getOrder        = (id)  => http.get(`${BASE}/orders/${id}`).then(r => r.data)
export const cancelOrder     = (id)  => http.patch(`${BASE}/orders/${id}/cancel`).then(r => r.data)
