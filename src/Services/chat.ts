// Stub implementation for chat service

export interface ChatMessage {
  id: string
  message: string
  sender: string
  timestamp: Date
  [key: string]: unknown
}

export const chatService = {
  sendMessage: async (message: string) => ({ success: true, message }),
  
  getMessages: async () => [],
  
  subscribeToMessages: (_callback: (message: ChatMessage) => void) => {
    // Stub implementation
    void _callback;
    return () => {};
  }
  ,
}

export default chatService