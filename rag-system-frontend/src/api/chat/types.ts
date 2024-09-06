export type ChatParams = {
  message: string
}

export type ChatResponse = {
  choices: {
    message: {
      role: 'assitent'
      content: string
    }
  }
}

export type ChatHistoryResponse = {
  id: number
  timestamp: string
}

export type GetChatHistoryParams = {
  historyId: number
}

export type SingleChatHistoryResponse = {
  messages: {
    role: 'user' | 'model'
    content: string
  }
}

export type CreateChatHistoryParams = {
  message: string
}

export type DeleteChatHistoryParams = {
    id: number
}

