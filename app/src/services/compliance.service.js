import http from './http'
const BASE = '/api/v1/Compliance'
export const createDocument       = (p)     => http.post(`${BASE}/documents`, p).then(r => r.data)
export const getMyDocuments       = ()       => http.get(`${BASE}/documents/mine`).then(r => r.data)
export const updateDocumentStatus = (id, p)  => http.patch(`${BASE}/documents/${id}/status`, p).then(r => r.data)
export const checkOrderCompliance = (id)     => http.get(`${BASE}/orders/${id}/check`).then(r => r.data)
