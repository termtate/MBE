import { api } from '..'
import type {
  ChatHistoryResponse,
  ChatParams,
  ChatResponse,
  CreateChatHistoryParams,
  DeleteChatHistoryParams,
  GetChatHistoryParams,
  SingleChatHistoryResponse
} from './types'

export async function chat(data: ChatParams) {
  return (await api.post<ChatResponse>('/chat', data)).data
}

export async function getChatHistories() {
  return (await api.get<ChatHistoryResponse[]>('/api/chat-histories')).data
}

export async function getChatHistory(params: GetChatHistoryParams) {
  return (await api.get<SingleChatHistoryResponse>(`/chat-history/${params.historyId}`)).data
}

export async function createChatHistory(params: CreateChatHistoryParams) {
  return (await api.post<ChatHistoryResponse>('/api/chat-histories', params)).data
}

export async function deleteChatHistory(params: DeleteChatHistoryParams) {
  await api.delete(`/api/chat-histories/${params.id}`)
}
