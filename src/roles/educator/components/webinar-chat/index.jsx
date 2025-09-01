import SendIcon from '@mui/icons-material/Send'
import {
  Box,
  useTheme,
  TextField,
  IconButton,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  Chip,
  Avatar,
} from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import io from 'socket.io-client'

const useFetchChatsQuery = (...args) => {
  args
  return {
    isFetching: false,
    data: [],
    error: null,
  }
}

const WebinarRoom = () => {
  const { roomId } = useParams()
  const theme = useTheme()
  const [socket, setSocket] = useState(null)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [users, setUsers] = useState([])
  const [username, setUsername] = useState(`User_${Math.floor(Math.random() * 1000)}`)
  const [isConnected, setIsConnected] = useState(false)
  const [typingUsers, setTypingUsers] = useState(new Set())
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  const { isFetching } = useFetchChatsQuery(
    {
      roomId,
      isGroup: true,
      isWebinarGroup: true,
    },
    {
      skip: !roomId,
    },
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (!roomId) {
      return
    }

    const newSocket = io('http://localhost:3001')
    setSocket(newSocket)

    newSocket.on('connect', () => {
      console.log('Connected to chat server')
      setIsConnected(true)
      newSocket.emit('join-room', roomId, username)
    })

    newSocket.on('joined-room', (joinedRoomId) => {
      console.log(`Joined room: ${joinedRoomId}`)
    })

    newSocket.on('receive-message', (messageData) => {
      setMessages((prev) => [...prev, messageData])
    })

    newSocket.on('room-users', (roomUsers) => {
      setUsers(roomUsers)
    })

    newSocket.on('user-joined', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: data.message,
          timestamp: new Date().toISOString(),
        },
      ])
    })

    newSocket.on('user-left', (data) => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          system: true,
          message: data.message,
          timestamp: new Date().toISOString(),
        },
      ])
    })

    newSocket.on('user-typing', (data) => {
      setTypingUsers((prev) => new Set([...prev, data.username]))
    })

    newSocket.on('user-stop-typing', (data) => {
      setTypingUsers((prev) => {
        const newSet = new Set(prev)
        users.forEach((user) => {
          if (user.id === data.userId) {
            newSet.delete(user.username)
          }
        })
        return newSet
      })
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server')
      setIsConnected(false)
    })

    return () => {
      newSocket.emit('leave-room', roomId, username)
      newSocket.disconnect()
    }
  }, [roomId, username])

  const sendMessage = () => {
    if (inputMessage.trim() && socket && isConnected) {
      socket.emit('send-message', {
        roomId,
        message: inputMessage,
        username,
      })
      setInputMessage('')
      handleStopTyping()
    }
  }

  const handleTyping = () => {
    if (socket && isConnected) {
      socket.emit('typing', { roomId, username })

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }

      typingTimeoutRef.current = setTimeout(() => {
        handleStopTyping()
      }, 1000)
    }
  }

  const handleStopTyping = () => {
    if (socket && isConnected) {
      socket.emit('stop-typing', { roomId })
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    } else {
      handleTyping()
    }
  }

  return (
    !isFetching && (
      <Box
        sx={{
          [theme.breakpoints.down('md')]: { width: '100%' },
          width: '400px',
          height: '600px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Paper elevation={3} sx={{ flex: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Box sx={{ mb: 2 }}>
            <Typography variant="h6" gutterBottom>
              Webinar Chat - Room: {roomId}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Chip
                label={isConnected ? 'Connected' : 'Disconnected'}
                color={isConnected ? 'success' : 'error'}
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                {users.length} users online
              </Typography>
            </Box>
          </Box>

          <Divider />

          <List
            sx={{
              flex: 1,
              overflow: 'auto',
              my: 2,
              bgcolor: 'background.paper',
              borderRadius: 1,
              border: '1px solid',
              borderColor: 'divider',
            }}
          >
            {messages.map((msg) => (
              <ListItem key={msg.id} alignItems="flex-start">
                {msg.system ? (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontStyle: 'italic', width: '100%', textAlign: 'center' }}
                  >
                    {msg.message}
                  </Typography>
                ) : (
                  <Box sx={{ width: '100%' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar sx={{ width: 24, height: 24, fontSize: '0.75rem' }}>
                        {msg.username?.[0]?.toUpperCase()}
                      </Avatar>
                      <Typography variant="subtitle2" color="primary">
                        {msg.username}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </Typography>
                    </Box>
                    <ListItemText
                      primary={msg.message}
                      sx={{ ml: 4 }}
                      primaryTypographyProps={{ variant: 'body2' }}
                    />
                  </Box>
                )}
              </ListItem>
            ))}
            <div ref={messagesEndRef} />
          </List>

          {typingUsers.size > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mb: 1 }}>
              {Array.from(typingUsers).join(', ')} {typingUsers.size === 1 ? 'is' : 'are'} typing...
            </Typography>
          )}

          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!isConnected}
              autoFocus
            />
            <IconButton
              color="primary"
              onClick={sendMessage}
              disabled={!isConnected || !inputMessage.trim()}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Paper>
      </Box>
    )
  )
}

export default WebinarRoom
