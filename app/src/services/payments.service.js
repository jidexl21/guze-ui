import http from './http'
const BASE = '/api/v1/Payments'
export const initiatePayment      = (p)        => http.post(`${BASE}/initiate`, p).then(r => r.data)
export const handleWebhook        = (p)        => http.post(`${BASE}/webhook`, p)
export const getOrderPayments     = (id)       => http.get(`${BASE}/order/${id}`).then(r => r.data)
export const getCommissionSummary = (id, p={}) => http.get(`${BASE}/commission/${id}`, { params: p }).then(r => r.data)
