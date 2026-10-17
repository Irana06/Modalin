import axios from 'axios'

export const toast = (message, type = 'success') =>
  window.dispatchEvent(new CustomEvent('app:toast', { detail: { message, type } }))

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? '/api',
  headers: { Accept: 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Unwraps { success, message, data } and handles errors in one place.
// 401 ends the session. Failed GETs are shown in the page (DataState), 422/429 by the form that sent them,
// and any other failed action becomes a toast.
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status
    const message = error.response?.data?.message ?? 'Tidak bisa terhubung ke server. Periksa koneksi Anda.'

    if (status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token')
      window.location.assign('/masuk')
    } else if (error.config?.method !== 'get' && ![401, 422, 429].includes(status)) {
      toast(message, 'error')
    }
    return Promise.reject({ status, message, errors: error.response?.data?.errors ?? {} })
  },
)

export default api
