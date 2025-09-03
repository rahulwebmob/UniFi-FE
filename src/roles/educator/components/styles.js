import { Box, styled } from '@mui/material'

export const CarouselItem = styled(Box)(() => ({
  cursor: 'pointer',
  background: 'linear-gradient(135deg, #1a1a1f 0%, #2d2d35 100%)',
  width: '200px',
  height: '100px',
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  overflow: 'hidden',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  margin: '0 8px',
}))

export const CarouselIcon = styled(Box)(() => ({
  background: 'linear-gradient(135deg, #2a2a32 0%, #3a3a45 100%)',
  width: '48px',
  height: '48px',
  borderRadius: '50%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
  transition: 'all 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(135deg, #3a3a45 0%, #4a4a55 100%)',
    transform: 'scale(1.05)',
  },
}))

export const WebinarContainer = styled(Box)(() => ({
  width: '100%',
  background: 'linear-gradient(180deg, #0d0d0f 0%, #1a1a1f 100%)',
  borderRadius: '16px',
  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
  paddingX: '0',
  margin: '0 auto',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
  },
}))

export const VideoPlaceholder = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  margin: '16px auto',
  background: 'radial-gradient(ellipse at center, #1a1a1f 0%, #0d0d0f 100%)',
  borderRadius: '12px',
  position: 'relative',
  overflow: 'hidden',
  '&::after': {
    content: '""',
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(135deg, transparent 30%, rgba(255, 255, 255, 0.02) 50%, transparent 70%)',
    pointerEvents: 'none',
  },
}))

export const ControlsContainer = styled(Box)(({ theme }) => ({
  background: 'linear-gradient(180deg, rgba(26, 26, 31, 0.95) 0%, rgba(13, 13, 15, 0.98) 100%)',
  backdropFilter: 'blur(20px)',
  height: '72px',
  borderRadius: '0 0 16px 16px',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '24px',
  borderTop: '1px solid rgba(255, 255, 255, 0.08)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '200px',
    height: '1px',
    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
  },
}))

export const ControlButton = styled(Box)(({ disabled }) => ({
  textAlign: 'center',
  opacity: disabled ? 0.4 : 1,
  pointerEvents: disabled ? 'none' : 'auto',
  cursor: disabled ? 'not-allowed' : 'pointer',
  padding: '8px 16px',
  borderRadius: '8px',
  background: 'transparent',
  border: 'none',
  transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
  minWidth: '48px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '4px',
}))

export const ToolBarSection = styled(Box)(() => ({
  background: 'rgba(26, 26, 31, 0.9)',
  backdropFilter: 'blur(15px)',
  borderRadius: '12px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
  padding: '4px',
  '& .MuiIconButton-root': {
    padding: 0,
    transition: 'all 0.2s ease',
  },
  '& .activeTool': {
    background: 'linear-gradient(135deg, #4a9eff 0%, #3b82f6 100%)',
    borderRadius: '8px',
    svg: {
      path: {
        fill: '#ffffff',
      },
    },
  },
}))

export const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'block',
    borderRadius: '12px',
    backgroundColor: '#0d0d0f',
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
    overflow: 'hidden',
    position: 'relative',
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    borderRadius: '12px',
    justifyContent: 'center',
    background: 'radial-gradient(ellipse at center, #1a1a1f 0%, #0d0d0f 100%)',
  },
  videoStream: {
    width: '100%',
    height: '100%',
    display: 'block',
    borderRadius: '12px',
    backgroundColor: '#0d0d0f',
    objectFit: 'contain',
  },
  wrapper: {
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    position: 'absolute',
    bottom: '12px',
    left: '12px',
    padding: '6px 12px',
    background: 'rgba(0, 0, 0, 0.8)',
    backdropFilter: 'blur(10px)',
    borderRadius: '6px',
    color: '#ffffff',
    fontSize: '0.8rem',
    fontWeight: 500,
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  },
}
