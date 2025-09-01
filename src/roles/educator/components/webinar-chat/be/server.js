const { createServer } = require('http')

const cors = require('cors')
const express = require('express')
const { Server } = require('socket.io')

const app = express()
app.use(cors())
app.use(express.json())

const httpServer = createServer(app)
const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
})

const PORT = process.env.PORT || 3001

const rooms = new Map()

io.on('connection', (socket) => {
  console.log('User connected:', socket.id)

  socket.on('join-room', (roomId, username) => {
    socket.join(roomId)

    if (!rooms.has(roomId)) {
      rooms.set(roomId, new Set())
    }
    rooms.get(roomId).add({ id: socket.id, username })

    socket.emit('joined-room', roomId)

    socket.to(roomId).emit('user-joined', {
      userId: socket.id,
      username,
      message: `${username} joined the room`,
    })

    io.to(roomId).emit('room-users', Array.from(rooms.get(roomId)))

    console.log(`User ${username} (${socket.id}) joined room ${roomId}`)
  })

  socket.on('send-message', (data) => {
    const { roomId, message, username } = data

    const messageData = {
      id: Date.now(),
      userId: socket.id,
      username,
      message,
      timestamp: new Date().toISOString(),
    }

    io.to(roomId).emit('receive-message', messageData)

    console.log(`Message in room ${roomId} from ${username}: ${message}`)
  })

  socket.on('leave-room', (roomId, username) => {
    socket.leave(roomId)

    if (rooms.has(roomId)) {
      const roomUsers = rooms.get(roomId)
      roomUsers.forEach((user) => {
        if (user.id === socket.id) {
          roomUsers.delete(user)
        }
      })

      if (roomUsers.size === 0) {
        rooms.delete(roomId)
      } else {
        io.to(roomId).emit('room-users', Array.from(roomUsers))
      }
    }

    socket.to(roomId).emit('user-left', {
      userId: socket.id,
      username,
      message: `${username} left the room`,
    })

    console.log(`User ${username} (${socket.id}) left room ${roomId}`)
  })

  socket.on('typing', (data) => {
    const { roomId, username } = data
    socket.to(roomId).emit('user-typing', { userId: socket.id, username })
  })

  socket.on('stop-typing', (data) => {
    const { roomId } = data
    socket.to(roomId).emit('user-stop-typing', { userId: socket.id })
  })

  socket.on('disconnect', () => {
    rooms.forEach((users, roomId) => {
      users.forEach((user) => {
        if (user.id === socket.id) {
          users.delete(user)
          socket.to(roomId).emit('user-left', {
            userId: socket.id,
            username: user.username,
            message: `${user.username} disconnected`,
          })

          if (users.size === 0) {
            rooms.delete(roomId)
          } else {
            io.to(roomId).emit('room-users', Array.from(users))
          }
        }
      })
    })

    console.log('User disconnected:', socket.id)
  })
})

app.get('/health', (req, res) => {
  res.json({ status: 'OK', rooms: rooms.size })
})

app.get('/rooms/:roomId/users', (req, res) => {
  const { roomId } = req.params
  const users = rooms.has(roomId) ? Array.from(rooms.get(roomId)) : []
  res.json({ roomId, users, count: users.length })
})

httpServer.listen(PORT, () => {
  console.log(`Chat server running on port ${PORT}`)
})
