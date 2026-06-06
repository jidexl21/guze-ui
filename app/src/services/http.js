import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://guzeapi.xl21.org/'

const http = axios.create({ baseURL: BASE_URL, headers: { 'Content-Type': 'application/json' }, timeout: 15000 })

http.interceptors.request.use((config) => {
  const token = localStorage.getItem('guze_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let isRefreshing = false, failedQueue = []
function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => error ? reject(error) : resolve(token))
  failedQueue = []
}

http.interceptors.response.use(res => res, async (err) => {
  const original = err.config
  if (err.response?.status === 401 && !original._retry) {
    original._retry = true
    if (isRefreshing) return new Promise((resolve, reject) => failedQueue.push({ resolve, reject }))
      .then(token => { original.headers.Authorization = `Bearer ${token}`; return http(original) })
    isRefreshing = true
    const refreshToken = localStorage.getItem('guze_refresh')
    if (!refreshToken) { isRefreshing = false; window.location.href = '/login'; return Promise.reject(err) }
    try {
      const { data } = await axios.post(`${BASE_URL}api/v1/auth/refresh`, { refreshToken })
      const newToken = data.data?.accessToken
      localStorage.setItem('guze_token', newToken)
      localStorage.setItem('guze_refresh', data.data?.refreshToken)
      http.defaults.headers.common.Authorization = `Bearer ${newToken}`
      processQueue(null, newToken)
      original.headers.Authorization = `Bearer ${newToken}`
      return http(original)
    } catch (e) { processQueue(e, null); localStorage.clear(); window.location.href = '/login'; return Promise.reject(e) }
    finally { isRefreshing = false }
  }
  return Promise.reject(err)
})

export default http
