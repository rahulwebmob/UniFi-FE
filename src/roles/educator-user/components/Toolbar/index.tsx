import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useRef, useState } from 'react'
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

import { Box, Button, Drawer } from '@mui/material'

import WhiteBoard from '../white-board'
// import ConferenceChat from '../../Conference/ConferenceChat/ConferenceChat'
import ControlIcon from './control-icon'
import { ControlsContainer } from '../styles'
import RecordingPopup from '../recording-popup'
import { isAndroidOrIphone } from '../common/common'
import WebinarAttachments from '../webinar-attachments'
import useFullscreen from '../../../../hooks/useFullscreen'
import useScreenRecorder from '../../../../hooks/useScreenRecorder'
import ModalBox from '../../../../shared/components/ui-elements/modal-box'
import MuiCarousel from '../../../../shared/components/ui-elements/mui-carousel'

interface MediaStatus {
  isAudio: boolean
  isVideo: boolean
  isScreen: boolean
}

interface ToolbarProps {
  isHost: boolean
  audioStream: MediaStream | null | undefined
  mediaStatus: MediaStatus
  handleRaiseHand: () => void
  handleEndWebinar: () => void
  handleTurnedMicOn: () => void
  handleTurnedVideoOn: () => void
  handleTurnedScreenShare: () => void
}

const Toolbar = ({
  isHost,
  audioStream,
  mediaStatus,
  handleRaiseHand,
  handleEndWebinar,
  handleTurnedMicOn,
  handleTurnedVideoOn,
  handleTurnedScreenShare,
}: ToolbarProps) => {
  const navigate = useNavigate()
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const whiteBoardRef = useRef<{
    openModal: () => void
    closeModal: () => void
  } | null>(null)
  const { t } = useTranslation('application')

  const { isLoading } = useSelector(
    (state: { education: { isLoading: boolean } }) => state.education,
  )
  const { isFullscreen } = useSelector(
    (state: { app: { isFullscreen: boolean } }) => state.app,
  )

  const { handleFullScreen, handleExitFullScreen } = useFullscreen()
  const { isRecording, handleToggleRecording } = useScreenRecorder({
    isHost,
    externalAudioStream: audioStream as MediaStream | null | undefined,
    isMicAudioRequired: mediaStatus.isAudio,
  })

  const [isRecPopup, setIsRecPopup] = useState(false)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [activeDrawerContent, setActiveDrawerContent] = useState<string | null>(
    null,
  )
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

  const handleToggleFullscreen = () =>
    isFullscreen ? handleExitFullScreen() : handleFullScreen()

  const handleLeaveCall = () => {
    if (isHost) handleEndWebinar()
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
    if (!mediaStatus.isScreen && !isAndroidOrIphone()) handleTurnedScreenShare()
  }

  const handleOpenDrawer = (content: string) => {
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
              label={
                mediaStatus.isAudio
                  ? t('application:CONFERENCE.CONTROL_SECTION.MUTE')
                  : t('application:CONFERENCE.CONTROL_SECTION.UNMUTE')
              }
              icon={
                mediaStatus.isAudio ? <Mic size={18} /> : <MicOff size={18} />
              }
            />
            <ControlIcon
              disabled={isLoading}
              onClick={handleTurnedVideoOn}
              isActive={mediaStatus.isVideo}
              isRecording={isRecording}
              label={
                mediaStatus.isVideo
                  ? t('application:CONFERENCE.CONTROL_SECTION.STOP_VIDEO')
                  : t('application:CONFERENCE.CONTROL_SECTION.START_VIDEO')
              }
              icon={
                mediaStatus.isVideo ? (
                  <Video size={18} />
                ) : (
                  <VideoOff size={18} />
                )
              }
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
            label={t('application:CONFERENCE.CONTROL_SECTION.CHAT')}
          />
          <ControlIcon
            disabled={isLoading}
            icon={<Paperclip size={18} />}
            label={t('application:CONFERENCE.CONTROL_SECTION.ATTACHMENTS')}
            onClick={() => handleOpenDrawer('attachments')}
            isActive={activeDrawerContent === 'attachments' && isDrawerOpen}
            isRecording={isRecording}
          />
          {!isHost && (
            <ControlIcon
              label={t('application:CONFERENCE.CONTROL_SECTION.RAISE_HAND')}
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
              label={
                mediaStatus.isScreen
                  ? t('application:CONFERENCE.CONTROL_SECTION.STOP_SHARING')
                  : t('application:CONFERENCE.CONTROL_SECTION.SHARE_SCREEN')
              }
            />
          )}
          {isHost && (
            <ControlIcon
              icon={<PenTool size={18} />}
              disabled={isLoading}
              onClick={handleOpenWhiteBoard}
              isRecording={isRecording}
              label={t('application:CONFERENCE.CONTROL_SECTION.WHITE_BOARD')}
            />
          )}
          <ControlIcon
            disabled={isLoading}
            isActive={isFullscreen}
            icon={<Maximize size={18} />}
            onClick={handleToggleFullscreen}
            isRecording={isRecording}
            label={
              isFullscreen
                ? t('application:CONFERENCE.CONTROL_SECTION.EXIT')
                : t('application:CONFERENCE.CONTROL_SECTION.FULL_SCREEN')
            }
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
              label={
                isRecording
                  ? t('application:CONFERENCE.CONTROL_SECTION.STOP_RECORD')
                  : t('application:CONFERENCE.CONTROL_SECTION.RECORD')
              }
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
        {isHost
          ? t('application:CONFERENCE.CONTROL_SECTION.END_CALL')
          : t('application:CONFERENCE.CONTROL_SECTION.LEAVE_CALL')}
      </Button>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
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
            <Box p={2}>
              <div>Chat feature temporarily disabled</div>
            </Box>
          )}
          {activeDrawerContent === 'attachments' && (
            <WebinarAttachments
              isHost={isHost}
              handleOnClose={() => setIsDrawerOpen(false)}
            />
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

export default Toolbar
