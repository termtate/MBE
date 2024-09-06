import type { Role } from '../role/types'

export type UserResponse = {
  id: number
  username: string
}

export type UpdateUserRoleParams = {
  userId: number
  data: {
    role: Role
  }
}

export type UpdateUserPwdParams = {
  userId: number
  data: {
    password: string
  }
}

export type DeleteUserParams = {
  userId: number
}
