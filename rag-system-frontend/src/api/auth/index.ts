import { api } from '../index'
import { token } from './jwt'
import type { LoginParams, LoginResponse, RegisterParams, RegisterResponse } from './types'

export async function login(data: LoginParams): Promise<LoginResponse> {
  const res = await api.post<LoginResponse>('/login', data)
  token.setToken(res.data.access_token)
  return res.data
}

export async function register(data: RegisterParams): Promise<RegisterResponse> {
  return (await api.post<RegisterResponse>('/register', data)).data
}
