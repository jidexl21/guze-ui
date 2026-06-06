import http from './http'
const BASE = '/api/v1/Shipments'
export const createShipment      = (p)    => http.post(BASE, p).then(r => r.data)
export const getShipment         = (id)   => http.get(`${BASE}/${id}`).then(r => r.data)
export const updateShipment      = (id,p) => http.patch(`${BASE}/${id}`, p).then(r => r.data)
export const getShipmentsByOrder = (id)   => http.get(`${BASE}/order/${id}`).then(r => r.data)
export const getMyShipments      = (p={}) => http.get(`${BASE}/mine`, { params: p }).then(r => r.data)
export const trackShipment       = (num)  => http.get(`${BASE}/track/${num}`).then(r => r.data)
