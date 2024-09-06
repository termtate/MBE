import type { Role } from '../role/types'

export type LoginParams = {
  username: string
  password: string
}

export type LoginResponse = {
  access_token: string
}

export type RegisterParams = LoginParams

export type RegisterResponse = {
  role: Role
}
