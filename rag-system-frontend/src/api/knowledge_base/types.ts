export type AddKnowledgeBaseEntryParams = {
  data: string
  embedding: string | null
}

export type GetKnowledgeBaseEntryParams = {
  keyword: string
}

export type GetKnowledgeBaseEntryResponse = {
  id: number
  data: string
  embedding: string
  createdAt: string
}

export type UpdateKnowledgeBaseEntryResponseParams = {
  entryId: number
}

export type UpdateKnowledgeBaseEntryResponse = {
  entryId: number
  data: AddKnowledgeBaseEntryParams
}

export type DeleteKnowledgeBaseEntryResponseParams = UpdateKnowledgeBaseEntryResponse
