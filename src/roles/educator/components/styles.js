import { Box, styled } from '@mui/material'

export const CarouselItem = styled(Box)(({ theme }) => ({
  cursor: 'pointer',
  background: theme.palette.grey[700],
  width: '200px',
  height: '100px',
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}))

export const CarouselIcon = styled(Box)(({ theme }) => ({
  background: theme.palette.grey[700],
  width: '43px',
  height: '43px',
  borderRadius: '30px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}))

export const WebinarContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  background: theme.palette.grey[800],
  borderRadius: '8px',
  boxShadow: '0px 0px 30px rgba(24, 60, 119, 0.5)',
  paddingX: '0',
  margin: '0 auto',
}))

export const VideoPlaceholder = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  margin: '10px auto',
}))

export const ControlsContainer = styled(Box)(({ theme }) => ({
  background: theme.palette.info.main,
  height: '63px',
  borderRadius: '0 0px 8px 8px',
  padding: theme.spacing(2),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',
}))

export const ControlButton = styled(Box)(({ theme, disabled }) => ({
  textAlign: 'center',
  opacity: disabled ? 0.5 : 1,
  pointerEvents: disabled ? 'none' : 'auto',
  cursor: disabled ? 'not-allowed' : 'pointer',
  svg: {
    fontSize: '24px',
    fill: theme.palette.grey[200],
    marginBottom: '5px',
  },
}))

export const ToolBarSection = styled(Box)(({ theme }) => ({
  background: theme.palette.primary.light,
  borderRadius: '10px',
  border: `2px solid ${theme.palette.grey[300]}`,
  '& .MuiIconButton-root': {
    padding: 0,
  },
  '& .activeTool': {
    svg: {
      path: {
        fill: theme.palette.primary.main,
      },
    },
  },
}))

export const styles = {
  container: {
    width: '100%',
    height: '100%',
    display: 'block',
    borderRadius: '10px',
    backgroundColor: 'transparent',
    border: (t) => `1px solid ${t.palette.primary.main}`,
  },
  videoContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    overflow: 'hidden',
    position: 'relative',
    alignItems: 'center',
    borderRadius: '10px',
    justifyContent: 'center',
  },
  videoStream: {
    width: '100%',
    height: '100%',
    display: 'block',
    borderRadius: '10px',
    backgroundColor: 'transparent',
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
    bottom: 0,
    left: 0,
    padding: '4px 8px',
  },
}
