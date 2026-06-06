import http from './http'
const BASE = '/api/v1/supplier/orders'
export const getOrders         = (p={})  => http.get(BASE, { params: p }).then(r => r.data)
export const getOrder          = (id)    => http.get(`${BASE}/${id}`).then(r => r.data)
export const updateOrderStatus = (id,p)  => http.patch(`${BASE}/${id}/status`, p).then(r => r.data)
export const getCommission     = (p={})  => http.get(`${BASE}/commission`, { params: p }).then(r => r.data)
export const getInvoices       = ()      => http.get(`${BASE}/invoices`).then(r => r.data)
