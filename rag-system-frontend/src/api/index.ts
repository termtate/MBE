import axios from 'axios'
import { token } from './auth/jwt'

export const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  timeout: import.meta.env.VITE_BACKEND_CONNECT_TIMEOUT
})

api.interceptors.request.use((config) => {
  if (token.hasToken()) {
    config.headers.set('Bearer', token.value)
  } else {
    console.log(`user unlogged. config: ${config}`)
  }
  return config
})

api.interceptors.response.use(
  (resp) => resp,
  (error) => {
    console.error(`axios response error: ${error}`)
  }
)
