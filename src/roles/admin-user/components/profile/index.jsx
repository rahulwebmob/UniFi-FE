import { Box, Card, alpha, Avatar, Button, Divider, useTheme, Typography } from '@mui/material'
import { Lock, User } from 'lucide-react'
import { useRef } from 'react'
import { useSelector } from 'react-redux'

import ModalBox from '../../../../shared/components/ui-elements/modal-box'

import ChangePassword from './ChangePassword'
import EditName from './EditName'

const Profile = () => {
  const theme = useTheme()
  const { firstName, lastName, email } = useSelector((state) => state.user.user)
  const passwordRef = useRef(null)

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 600,
            mb: 0.5,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Profile Settings
        </Typography>
        <Typography component="p" color="text.secondary">
          Manage your account information and security settings
        </Typography>
      </Box>

      <Box
        sx={{
          p: 3,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {/* Profile Info Card */}
          <Card
            elevation={0}
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <Box
                sx={{
                  mr: 1.5,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <User size={20} />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                Personal Information
              </Typography>
            </Box>

            <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  fontSize: 36,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: 'white',
                  border: `3px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                  mb: 2,
                  fontWeight: 700,
                }}
              >
                {firstName?.[0]?.toUpperCase()}
                {lastName?.[0]?.toUpperCase()}
              </Avatar>
              <Typography variant="h5" fontWeight={600} color="text.primary">
                {firstName} {lastName}
              </Typography>
              <Typography variant="body1" color="text.secondary" mt={0.5}>
                {email}
              </Typography>
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box>
              <EditName />
            </Box>
          </Card>

          {/* Security Settings Card */}
          <Card
            elevation={0}
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 2,
              border: `1px solid ${alpha(theme.palette.grey[500], 0.08)}`,
              backgroundColor: theme.palette.background.paper,
            }}
          >
            <Box display="flex" alignItems="center" mb={3}>
              <Box
                sx={{
                  mr: 1.5,
                  color: 'primary.main',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Lock size={20} />
              </Box>
              <Typography variant="h6" fontWeight={600}>
                Password & Security
              </Typography>
            </Box>

            <Box
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.grey[500], 0.04),
                borderRadius: 1,
                mb: 2,
              }}
            >
              <Typography variant="body2" color="text.secondary" mb={2}>
                Keep your account secure by using a strong password
              </Typography>
              <Button
                variant="contained"
                startIcon={<Lock size={16} />}
                onClick={() => passwordRef.current?.openModal()}
                sx={{
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
                  color: 'white',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.primary.main})`,
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
                  },
                }}
              >
                Change Password
              </Button>
            </Box>

            <Box
              sx={{
                p: 2,
                bgcolor: alpha(theme.palette.info.main, 0.04),
                borderRadius: 1,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Last password change: Never
              </Typography>
            </Box>
          </Card>
        </Box>
      </Box>

      <ModalBox ref={passwordRef} title="Change Password" size="sm">
        <ChangePassword closeModal={() => passwordRef.current?.closeModal()} isUserAdmin />
      </ModalBox>
    </Box>
  )
}

export default Profile
