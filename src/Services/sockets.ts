import { io } from 'socket.io-client'

import { ENV } from '../Utils/env'

const socketUrl = `${ENV.BASE_URL}`

let chatSocket
let videoSocket
let binanceSocket
let intrinioSocket

const defaultSocketSettings = {
  transports: ['websocket', 'polling'],
  reconnectionAttempts: 5,
  reconnectionDelay: 3000,
}

const chatConnection = (token) => {
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

const videoConnection = (token) => {
  videoSocket = io(`${socketUrl}/video-chat`, {
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

// const intrinioConnection = (token) => {
//   intrinioSocket = io(`${socketUrl}/external`, {
//     path: '/external-api/socket/',
//     auth: {
//       token,
//     },
//     ...defaultSocketSettings,
//   })
//     .on('connect', () => {
//       // console.warn('socket connected')
//     })
//     .on('connect_error', () => {
//       // console.warn('settings err', err)
//     })
// }

const binanceConnection = (token) => {
  binanceSocket = io(`${socketUrl}/binance`, {
    path: '/binance-api/socket/',
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

const initializeSocket = (token, isExternal = true) => {
  if (!chatSocket || !videoSocket /* || !intrinioSocket */) {
    chatConnection(token)
    if (isExternal) {
      videoConnection(token)
      binanceConnection(token)
      // intrinioConnection(token)
    }
  } else {
    chatSocket.connect()
    if (isExternal) {
      videoSocket.connect()
      binanceSocket.connect()
      // intrinioSocket.connect()
    }
  }
}

// const disconnectIntrinioSocket = (removeListener) => {
//   if (intrinioSocket) {
//     intrinioSocket.disconnect()
//     intrinioSocket.close()
//     if (removeListener) intrinioSocket.removeAllListeners()
//     intrinioSocket = null
//   }
// }

const disconnectChatSocket = (removeListener) => {
  if (chatSocket) {
    chatSocket.disconnect()
    chatSocket.close()
    if (removeListener) chatSocket.removeAllListeners()
    chatSocket = null
  }
}

const disconnectVideoSocket = (removeListener) => {
  if (videoSocket) {
    videoSocket.disconnect()
    videoSocket.close()
    if (removeListener) videoSocket.removeAllListeners()
    videoSocket = null
  }
}

// const disconnectIntrinioSocket = (removeListener) => {
//   if (intrinioSocket) {
//     intrinioSocket.disconnect()
//     intrinioSocket.close()
//     if (removeListener) intrinioSocket.removeAllListeners()
//     intrinioSocket = null
//   }
// }

const disconnectAllSockets = (removeListener) => {
  disconnectChatSocket(removeListener)
  disconnectVideoSocket(removeListener)
  // disconnectIntrinioSocket(removeListener)
}

export {
  chatSocket,
  videoSocket,
  binanceSocket,
  intrinioSocket,
  chatConnection,
  videoConnection,
  initializeSocket,
  disconnectAllSockets,
}
