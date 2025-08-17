import { io, Socket } from 'socket.io-client'

import { ENV } from '../utils/env'

const socketUrl = `${ENV.BASE_URL}`

let chatSocket: Socket | null = null

const defaultSocketSettings = {
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
}

const chatConnection = (token: string) => {
  chatSocket = io(`${socketUrl}/chat`, {
    path: '/chat-api/socket/',
    auth: {
      token,
    },
    ...defaultSocketSettings,
  })
    .on('connect', () => {
      // console.warn('socket connected')
    })
    .on('connect_error', () => {
      // console.warn('settings err', err)
    })
}

const disconnectChatSocket = (removeListener: boolean) => {
  if (chatSocket) {
    chatSocket.disconnect()
    chatSocket.close()
    if (removeListener) chatSocket.removeAllListeners()
    chatSocket = null
  }
}

const disconnectAllSockets = (removeListener: boolean) => {
  disconnectChatSocket(removeListener)
}

const initializeSocket = (...args: unknown[]) => {
  // This function is deprecated or not implemented
  console.warn('initializeSocket is deprecated', args)
}

export { chatSocket, chatConnection, disconnectAllSockets, initializeSocket }
