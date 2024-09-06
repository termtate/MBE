import { api } from '..'
import type {
  AddKnowledgeBaseEntryParams,
  DeleteKnowledgeBaseEntryResponseParams,
  GetKnowledgeBaseEntryParams,
  GetKnowledgeBaseEntryResponse,
  UpdateKnowledgeBaseEntryResponseParams
} from './types'

export async function addKnowledgeBaseEntry(params: AddKnowledgeBaseEntryParams) {
  await api.post('/knowledge_base', params)
}

export async function getKnowledgeBaseEntries(params: GetKnowledgeBaseEntryParams) {
  return await api.get<GetKnowledgeBaseEntryResponse[]>('/knowledge_base', { params: params })
}

export async function updateKnowledgeBaseEntry(params: UpdateKnowledgeBaseEntryResponseParams) {
  await api.put(`/knowledge_base/${params.entryId}`)
}

export async function deleteKnowledgeBaseEntry(params: DeleteKnowledgeBaseEntryResponseParams) {
  await api.delete(`/knowledge_base/${params.entryId}`)
}
