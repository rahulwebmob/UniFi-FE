import { useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import { useDispatch } from 'react-redux'

import {
  Box,
  Grid,
  Button,
  Divider,
  useTheme,
  TextField,
  Typography,
  IconButton,
  InputAdornment,
} from '@mui/material'

import {
  successAlert,
  errorAlert,
} from '../../../../../redux/reducers/app-slice'

const Referrals = () => {
  const theme = useTheme()
  const dispatch = useDispatch()
  const [referralLink, setReferralLink] = useState(
    'https://unifi.com/ref/USER123456',
  )

  const handleCopyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink)
      dispatch(successAlert({ message: 'Referral link copied to clipboard!' }))
    } catch (error) {
      dispatch(errorAlert({ message: 'Failed to copy referral link' }))
    }
  }

  const handleGenerateNewReferral = () => {
    // Generate a new referral link
    const newCode = `https://unifi.com/ref/${Math.random().toString(36).substring(2, 8).toUpperCase()}`
    setReferralLink(newCode)
    dispatch(successAlert({ message: 'New referral link generated!' }))
  }

  return (
    <Box>
      {/* Header Section */}
      <Box sx={{ mb: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            mb: 1,
            color: theme.palette.text.primary,
          }}
        >
          Referral Program
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
          }}
        >
          Share your referral link with friends and earn rewards when they sign
          up and make their first purchase.
        </Typography>
      </Box>

      <Divider sx={{ mb: 3 }} />

      {/* Referral Code Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: theme.palette.text.primary,
          }}
        >
          Your Referral Link
        </Typography>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            alignItems: { xs: 'stretch', sm: 'flex-start' },
          }}
        >
          <TextField
            value={referralLink}
            disabled
            fullWidth
            size="small"
            sx={{
              maxWidth: { xs: '100%', sm: '450px' },
            }}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleCopyReferralLink} edge="end">
                      <Copy size={20} />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />

          <Button
            variant="outlined"
            size="medium"
            onClick={handleGenerateNewReferral}
            startIcon={<RefreshCw size={18} />}
          >
            Generate New Link
          </Button>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Box>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: theme.palette.text.primary,
          }}
        >
          How It Works
        </Typography>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.light + '30',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}
                >
                  1
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  Share Your Link
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Send your unique referral link to friends and family
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.light + '30',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 600,
                    color: theme.palette.primary.main,
                  }}
                >
                  2
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, mb: 0.5 }}
                >
                  They Sign Up
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Your friends sign up using your referral link
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Referrals
