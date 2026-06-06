import http from './http'
const BASE = '/api/v1/Notifications'
export const getNotifications = (p={}) => http.get(BASE, { params: p }).then(r => r.data)
export const processPending   = ()     => http.post(`${BASE}/process-pending`)
