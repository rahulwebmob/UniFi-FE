import { Box, Button, Drawer } from '@mui/material'
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
import RecordingPopup from '../recording-popup'
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

  const { isLoading } = useSelector((state) => state.education)
  const { isFullscreen } = useSelector((state) => state.app)

  const { handleFullScreen, handleExitFullScreen } = useFullscreen()
  const { isRecording, handleToggleRecording } = useScreenRecorder({
    isHost,
    externalAudioStream: audioStream,
    isMicAudioRequired: mediaStatus.isAudio,
  })

  const [isRecPopup, setIsRecPopup] = useState(false)
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
    if (isHost) {
      handleEndWebinar()
    }
    if (isHost) {
      void navigate('/educator/webinars')
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
    if (!mediaStatus.isScreen && !isAndroidOrIphone()) {
      handleTurnedScreenShare()
    }
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
              icon={mediaStatus.isAudio ? <Mic size={18} /> : <MicOff size={18} />}
            />
            <ControlIcon
              disabled={isLoading}
              onClick={handleTurnedVideoOn}
              isActive={mediaStatus.isVideo}
              isRecording={isRecording}
              label={mediaStatus.isVideo ? 'Stop Video' : 'Start Video'}
              icon={mediaStatus.isVideo ? <Video size={18} /> : <VideoOff size={18} />}
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
            icon={<MessageCircle size={18} />}
            onClick={() => handleOpenDrawer('chat')}
            isActive={activeDrawerContent === 'chat' && isDrawerOpen}
            isRecording={isRecording}
            label="Chat"
          />
          <ControlIcon
            disabled={isLoading}
            icon={<Paperclip size={18} />}
            label="Attachments"
            onClick={() => handleOpenDrawer('attachments')}
            isActive={activeDrawerContent === 'attachments' && isDrawerOpen}
            isRecording={isRecording}
          />
          {!isHost && (
            <ControlIcon
              label="Raise Hand"
              icon={<Hand size={18} />}
              onClick={handleDebounceRaiseHand}
              disabled={isLoading || isHandRaisedDisabled}
              isRecording={isRecording}
            />
          )}
          {isHost && !isAndroidOrIphone() && (
            <ControlIcon
              disabled={isLoading}
              icon={<ArrowUp size={18} />}
              isActive={mediaStatus.isScreen}
              onClick={handleTurnedScreenShare}
              isRecording={isRecording}
              label={mediaStatus.isScreen ? 'Stop Sharing' : 'Share Screen'}
            />
          )}
          {isHost && (
            <ControlIcon
              icon={<PenTool size={18} />}
              disabled={isLoading}
              onClick={handleOpenWhiteBoard}
              isRecording={isRecording}
              label="Whiteboard"
            />
          )}
          <ControlIcon
            disabled={isLoading}
            isActive={isFullscreen}
            icon={<Maximize size={18} />}
            onClick={handleToggleFullscreen}
            isRecording={isRecording}
            label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          />
          {!isAndroidOrIphone() && (
            <ControlIcon
              disabled={isLoading}
              isActive={isRecording}
              icon={<Circle size={18} />}
              onClick={() => {
                void handleToggleRecording()
                setIsRecPopup(true)
              }}
              isRecording={isRecording}
              label={isRecording ? 'Stop Recording' : 'Record'}
            />
          )}
        </MuiCarousel>
      </Box>

      <Button
        size="medium"
        color="error"
        variant="contained"
        onClick={handleLeaveCall}
        sx={{ borderRadius: '8px' }}
        disabled={isLoading}
      >
        {isHost ? 'End Call' : 'Leave Call'}
      </Button>

      <Drawer anchor="right" open={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <Box
          sx={{
            width: 400,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {activeDrawerContent === 'chat' && (
            <Box p={2}>
              <div>Chat feature temporarily disabled</div>
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
      {!isRecording && !isAndroidOrIphone() && !isRecPopup && (
        <RecordingPopup
          handleOnClose={() => setIsRecPopup((prev) => !prev)}
          handleToggleRecording={handleToggleRecording}
        />
      )}
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
