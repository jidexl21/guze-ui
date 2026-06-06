import http from './http'
const BASE = '/api/v1/auth'
export const register = (p)  => http.post(`${BASE}/register`, p).then(r => r.data)
export const login    = (p)  => http.post(`${BASE}/login`, p).then(r => r.data)
export const refresh  = (p)  => http.post(`${BASE}/refresh`, p).then(r => r.data)
export const logout   = ()   => http.post(`${BASE}/logout`).then(r => r.data)
export const me       = ()   => http.get(`${BASE}/me`).then(r => r.data)
