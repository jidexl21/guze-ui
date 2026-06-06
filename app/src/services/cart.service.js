import http from './http'
const BASE = '/api/v1/Cart'
export const getCart      = ()        => http.get(BASE).then(r => r.data)
export const getCartCount = ()        => http.get(`${BASE}/count`).then(r => r.data)
export const clearCart    = ()        => http.delete(BASE)
export const addItem      = (p)       => http.post(`${BASE}/items`, p).then(r => r.data)
export const updateItem   = (id, p)   => http.put(`${BASE}/items/${id}`, p).then(r => r.data)
export const removeItem   = (id)      => http.delete(`${BASE}/items/${id}`).then(r => r.data)
