import { Box, Card, Avatar, Button, Typography, CardContent } from '@mui/material'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'

const EducationPremium = ({ mediaDetails, setCurrentStep, subscriptionDetails }) => {
  const { t } = useTranslation('education')

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        '& .MuiPaper-root': {
          background: 'none',
        },
      }}
      mt={3}
    >
      <Card
        sx={{
          width: 400,
          borderRadius: 3,
          boxShadow: 4,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            height: 140,
            backgroundImage: `url(${mediaDetails?.coverImage})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
          }}
        >
          <Avatar
            alt="User Image"
            sx={{
              width: 80,
              height: 80,
              position: 'absolute',
              bottom: -40,
              left: 16,
              border: '3px solid white',
            }}
          >
            {`${mediaDetails?.educatorDetails?.firstName?.[0] || ''}${
              mediaDetails?.educatorDetails?.lastName?.[1] || ''
            }`}
          </Avatar>
        </Box>
        <CardContent sx={{ mt: 4 }}>
          <Typography variant="h6" component="div" fontWeight="bold">
            {subscriptionDetails?.[0]?.displayName || '-'}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ my: 1 }}>
            {subscriptionDetails?.[0]?.description || '-'}
          </Typography>
          <Typography variant="h5" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
            ${subscriptionDetails?.[0]?.price || '-'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ borderRadius: 3 }}
            onClick={() => {
              setCurrentStep((prev) => prev + 1)
            }}
          >
            {t('education:EDUCATION_DASHBOARD.COMMON_KEYS.BUY_NOW')}
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}

EducationPremium.propTypes = {
  mediaDetails: PropTypes.shape({
    coverImage: PropTypes.string,
    educatorDetails: PropTypes.shape({
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
  }),
  setCurrentStep: PropTypes.func,
  subscriptionDetails: PropTypes.arrayOf(
    PropTypes.shape({
      displayName: PropTypes.string,
      description: PropTypes.string,
      price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    }),
  ),
}

export default EducationPremium
