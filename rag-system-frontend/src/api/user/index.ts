import { api } from '..'
import type {
  DeleteUserParams,
  UpdateUserPwdParams,
  UpdateUserRoleParams,
  UserResponse
} from './types'

export async function getUsers() {
  return (await api.get<UserResponse[]>('/users')).data
}

export async function updateUserRole(params: UpdateUserRoleParams) {
  await api.put(`/users/${params.userId}/role`, params.data)
}

export async function updateUserPassword(params: UpdateUserPwdParams) {
  await api.put(`/users/${params.userId}/password`, params.data)
}

export async function deleteUser(params: DeleteUserParams) {
  return api.delete(`/users/${params.userId}`)
}
