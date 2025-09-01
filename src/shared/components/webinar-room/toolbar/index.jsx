import { Box, Drawer, Typography, TextField, IconButton, Button } from '@mui/material'
import {
  Mic,
  Hand,
  Video,
  MicOff,
  Circle,
  ArrowUp,
  PenTool,
  VideoOff,
  Maximize,
  Paperclip,
  MessageCircle,
  PhoneOff,
  Send,
} from 'lucide-react'
import PropTypes from 'prop-types'
import { useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

// import ConferenceChat from '../../Conference/ConferenceChat/ConferenceChat'
import useFullscreen from '../../../../hooks/useFullscreen'
import useScreenRecorder from '../../../../hooks/useScreenRecorder'
import ModalBox from '../../../../shared/components/ui-elements/modal-box'
import MuiCarousel from '../../../../shared/components/ui-elements/mui-carousel'
import { isAndroidOrIphone } from '../common/common'
import { ControlsContainer } from '../styles'
import WebinarAttachments from '../webinar-attachments'
import WhiteBoard from '../white-board'

import ControlIcon from './control-icon'

const Toolbar = ({
  isHost,
  audioStream,
  mediaStatus,
  handleRaiseHand,
  handleEndWebinar,
  handleTurnedMicOn,
  handleTurnedVideoOn,
  handleTurnedScreenShare,
}) => {
  const navigate = useNavigate()
  const intervalRef = useRef(null)
  const whiteBoardRef = useRef(null)
  const confirmModalRef = useRef(null)

  const { isLoading } = useSelector((state) => state.education)
  const { isFullscreen } = useSelector((state) => state.app)

  const { handleFullScreen, handleExitFullScreen } = useFullscreen()
  const { isRecording, handleToggleRecording } = useScreenRecorder({
    isHost,
    externalAudioStream: audioStream,
    isMicAudioRequired: mediaStatus.isAudio,
  })

  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeDrawerContent, setActiveDrawerContent] = useState(null)
  const [isHandRaisedDisabled, setIsHandRaisedDisabled] = useState(false)

  const handleDisableRefresh = () => {
    setIsHandRaisedDisabled(true)
    setTimeout(() => {
      setIsHandRaisedDisabled(false)
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }, 15000)
  }

  const handleToggleFullscreen = () => (isFullscreen ? handleExitFullScreen() : handleFullScreen())

  const handleLeaveCall = () => {
    confirmModalRef.current?.openModal()
  }

  const handleConfirmLeave = () => {
    confirmModalRef.current?.closeModal()
    if (isHost) {
      handleEndWebinar()
    }
    if (isHost) {
      navigate('/educator/webinars')
    } else {
      window.history.back()
    }
  }

  const handleDebounceRaiseHand = () => {
    handleRaiseHand()
    handleDisableRefresh()
  }

  const handleOpenWhiteBoard = () => {
    whiteBoardRef.current?.openModal()
  }

  const handleOpenDrawer = (content) => {
    setActiveDrawerContent(content)
    setIsDrawerOpen(true)
  }

  return (
    <ControlsContainer>
      <Box display="flex" gap="20px">
        {!!isHost && (
          <>
            <ControlIcon
              disabled={isLoading}
              onClick={handleTurnedMicOn}
              isActive={mediaStatus.isAudio}
              isRecording={isRecording}
              label={mediaStatus.isAudio ? 'Mute' : 'Unmute'}
              icon={mediaStatus.isAudio ? <Mic size={20} /> : <MicOff size={20} />}
            />
            <ControlIcon
              disabled={isLoading}
              onClick={handleTurnedVideoOn}
              isActive={mediaStatus.isVideo}
              isRecording={isRecording}
              label={mediaStatus.isVideo ? 'Stop Video' : 'Start Video'}
              icon={mediaStatus.isVideo ? <Video size={20} /> : <VideoOff size={20} />}
            />
          </>
        )}
      </Box>

      <Box
        display="flex"
        gap="20px"
        sx={{
          cursor: 'pointer',
          '& .MuiTabs-root ': {
            display: 'grid',
          },
          '& .MuiTabs-flexContainer': {
            display: 'inline-flex',
          },
          '& .MuiTabs-root.bg-active::after': {
            zIndex: -1,
          },
        }}
      >
        <MuiCarousel>
          <ControlIcon
            disabled={isLoading}
            icon={<MessageCircle size={20} />}
            onClick={() => handleOpenDrawer('chat')}
            isActive={activeDrawerContent === 'chat' && isDrawerOpen}
            isRecording={isRecording}
            label="Chat"
          />
          <ControlIcon
            disabled={isLoading}
            icon={<Paperclip size={20} />}
            label="Attachments"
            onClick={() => handleOpenDrawer('attachments')}
            isActive={activeDrawerContent === 'attachments' && isDrawerOpen}
            isRecording={isRecording}
          />
          {!isHost && (
            <ControlIcon
              label="Raise Hand"
              icon={<Hand size={20} />}
              onClick={handleDebounceRaiseHand}
              disabled={isLoading || isHandRaisedDisabled}
              isRecording={isRecording}
            />
          )}
          {isHost && !isAndroidOrIphone() && (
            <ControlIcon
              disabled={isLoading}
              icon={<ArrowUp size={20} />}
              isActive={mediaStatus.isScreen}
              onClick={handleTurnedScreenShare}
              isRecording={isRecording}
              label={mediaStatus.isScreen ? 'Stop Sharing' : 'Share Screen'}
            />
          )}
          {isHost && (
            <ControlIcon
              icon={<PenTool size={20} />}
              disabled={isLoading}
              onClick={handleOpenWhiteBoard}
              isRecording={isRecording}
              label="Whiteboard"
            />
          )}
          <ControlIcon
            disabled={isLoading}
            isActive={isFullscreen}
            icon={<Maximize size={20} />}
            onClick={handleToggleFullscreen}
            isRecording={isRecording}
            label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          />
          {!isAndroidOrIphone() && (
            <ControlIcon
              disabled={isLoading}
              isActive={isRecording}
              icon={
                isRecording ? (
                  <Box
                    sx={{
                      position: 'relative',
                      width: '20px',
                      height: '20px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Circle
                      size={20}
                      style={{
                        stroke: '#ff4444',
                        fill: 'none',
                        strokeWidth: 2,
                      }}
                    />
                    <Box
                      sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#ff4444',
                        animation: 'pulse 1.5s infinite',
                        '@keyframes pulse': {
                          '0%': {
                            scale: 0.9,
                            opacity: 1,
                          },
                          '50%': {
                            scale: 1.2,
                            opacity: 0.7,
                          },
                          '100%': {
                            scale: 0.9,
                            opacity: 1,
                          },
                        },
                      }}
                    />
                  </Box>
                ) : (
                  <Circle size={20} />
                )
              }
              onClick={() => {
                handleToggleRecording()
              }}
              isRecording={isRecording}
              label={isRecording ? 'Stop Recording' : 'Record'}
            />
          )}
        </MuiCarousel>
      </Box>

      <Box
        sx={{
          '& svg': {
            stroke: '#ff4444 !important',
          },
          '&:hover svg': {
            stroke: '#ff6b6b !important',
          },
          '& .MuiTypography-root': {
            color: '#ff4444 !important',
          },
          '&:hover .MuiTypography-root': {
            color: '#ff6b6b !important',
          },
        }}
      >
        <ControlIcon
          icon={<PhoneOff size={20} />}
          label={isHost ? 'End Call' : 'Leave Call'}
          onClick={handleLeaveCall}
          disabled={isLoading}
          isRecording={false}
        />
      </Box>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          '& .MuiDrawer-paper': {
            background: '#ffffff',
            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
            boxShadow: '-4px 0 15px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        <Box
          sx={{
            width: 400,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {activeDrawerContent === 'chat' && (
            <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
              {/* Chat Header */}
              <Box sx={{ p: 2, borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'text.primary',
                    fontWeight: 600,
                  }}
                >
                  Chat
                </Typography>
              </Box>

              {/* Chat Messages Area */}
              <Box sx={{ flex: 1, p: 2, overflowY: 'auto', backgroundColor: '#f9f9f9' }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    color: 'text.secondary',
                  }}
                >
                  <Typography variant="body2">No messages yet. Start a conversation!</Typography>
                </Box>
              </Box>

              {/* Chat Input */}
              <Box
                sx={{
                  p: 2,
                  borderTop: '1px solid rgba(0, 0, 0, 0.12)',
                  backgroundColor: '#ffffff',
                }}
              >
                <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
                  <TextField
                    fullWidth
                    multiline
                    maxRows={3}
                    placeholder="Type your message here..."
                    variant="outlined"
                    size="small"
                    disabled
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#f5f5f5',
                        '& fieldset': {
                          borderColor: 'rgba(0, 0, 0, 0.12)',
                        },
                      },
                    }}
                  />
                  <IconButton
                    disabled
                    sx={{
                      color: 'primary.main',
                      backgroundColor: '#f5f5f5',
                      '&:hover': {
                        backgroundColor: '#e0e0e0',
                      },
                    }}
                  >
                    <Send size={20} />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          )}
          {activeDrawerContent === 'attachments' && (
            <WebinarAttachments isHost={isHost} handleOnClose={() => setIsDrawerOpen(false)} />
          )}
        </Box>
      </Drawer>
      <ModalBox size="xl" ref={whiteBoardRef}>
        <WhiteBoard />
      </ModalBox>
      <ModalBox size="sm" ref={confirmModalRef}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
          {isHost ? 'End Webinar?' : 'Leave Webinar?'}
        </Typography>
        <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
          {isHost
            ? 'Are you sure you want to end this webinar? This will disconnect all participants.'
            : 'Are you sure you want to leave this webinar?'}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
          <Button
            variant="outlined"
            onClick={() => confirmModalRef.current?.closeModal()}
            sx={{ minWidth: 100 }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirmLeave}
            sx={{ minWidth: 100 }}
          >
            {isHost ? 'End' : 'Leave'}
          </Button>
        </Box>
      </ModalBox>
    </ControlsContainer>
  )
}

Toolbar.propTypes = {
  isHost: PropTypes.bool.isRequired,
  audioStream: PropTypes.object,
  mediaStatus: PropTypes.shape({
    isAudio: PropTypes.bool,
    isVideo: PropTypes.bool,
    isScreen: PropTypes.bool,
  }).isRequired,
  handleRaiseHand: PropTypes.func.isRequired,
  handleEndWebinar: PropTypes.func.isRequired,
  handleTurnedMicOn: PropTypes.func.isRequired,
  handleTurnedVideoOn: PropTypes.func.isRequired,
  handleTurnedScreenShare: PropTypes.func.isRequired,
}

export default Toolbar
