import { Box, Stepper, Step, StepLabel, useTheme, Divider, Typography } from '@mui/material'
import { CreditCard, MapPin, ShoppingCart, CheckCircle } from 'lucide-react'
import PropTypes from 'prop-types'
import { useState, forwardRef } from 'react'

import ModalBox from '../../ui-elements/modal-box'

import AddNewCard from './add-new-card'
import BillingAddress from './billing-adress'
import ReviewEducation from './review-education'

const CustomStepIcon = (props) => {
  const { active, completed, iconComponent: Icon } = props
  const theme = useTheme()

  return (
    <Box
      sx={{
        color: completed
          ? theme.palette.success.main
          : active
            ? theme.palette.primary.main
            : theme.palette.grey[400],
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {completed ? <CheckCircle size={24} /> : <Icon size={24} />}
    </Box>
  )
}

CustomStepIcon.propTypes = {
  active: PropTypes.bool,
  completed: PropTypes.bool,
  iconComponent: PropTypes.elementType,
}

const PremiumModal = forwardRef(({ purchaseDetails }, ref) => {
  const [currentStep, setCurrentStep] = useState(0)
  const [subscriptionFormData, setSubscriptionFormData] = useState({})

  const steps = [
    { label: 'Payment Details', icon: CreditCard },
    { label: 'Billing Address', icon: MapPin },
    { label: 'Review Order', icon: ShoppingCart },
  ]

  const resetModal = () => {
    setCurrentStep(0)
    setSubscriptionFormData({})
  }

  const closeModal = () => {
    if (ref && 'current' in ref && ref.current) {
      ref.current.closeModal()
    }
    resetModal()
  }

  const getStepIconComponent = (step, index) => (
    <CustomStepIcon
      active={currentStep === index}
      completed={currentStep > index}
      iconComponent={step.icon}
    />
  )

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <AddNewCard
            setCurrentStep={setCurrentStep}
            setSubscriptionFormData={setSubscriptionFormData}
            subscriptionFormData={subscriptionFormData}
          />
        )
      case 1:
        return (
          <BillingAddress
            setCurrentStep={setCurrentStep}
            setSubscriptionFormData={setSubscriptionFormData}
            subscriptionFormData={subscriptionFormData}
          />
        )
      case 2:
        return (
          <ReviewEducation
            closeModal={closeModal}
            setCurrentStep={setCurrentStep}
            purchaseDetails={purchaseDetails}
            transactionInfo={subscriptionFormData}
          />
        )
      default:
        return null
    }
  }

  return (
    <ModalBox
      ref={ref}
      title={undefined}
      size="lg"
      disablePadding
      onCloseModal={() => {
        resetModal()
        if (ref && 'current' in ref && ref.current) {
          ref.current.closeModal()
        }
      }}
    >
      <Box>
        <Box sx={{ px: 3, pt: 3, pb: 2 }}>
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
            Complete Purchase
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {purchaseDetails?.purchaseType === 'COURSE'
              ? `Purchase access to ${purchaseDetails?.title || 'this course'}`
              : purchaseDetails?.purchaseType === 'WEBINAR'
                ? `Register for ${purchaseDetails?.title || 'this webinar'}`
                : 'Subscribe to premium plan'}
          </Typography>
        </Box>
        <Box
          sx={{
            width: '100%',
            px: 3,
            pb: 2,
            '& .MuiStepLabel-label': {
              fontSize: '0.875rem',
              mt: 1,
            },
          }}
        >
          <Stepper activeStep={currentStep} alternativeLabel>
            {steps.map((step, index) => (
              <Step key={step.label}>
                <StepLabel StepIconComponent={() => getStepIconComponent(step, index)}>
                  {step.label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>
        <Divider />
        {renderStepContent()}
      </Box>
    </ModalBox>
  )
})

PremiumModal.displayName = 'PremiumModal'

PremiumModal.propTypes = {
  purchaseDetails: PropTypes.shape({
    purchaseType: PropTypes.string,
    title: PropTypes.string,
    _id: PropTypes.string,
    scheduledDate: PropTypes.string,
    thumbNail: PropTypes.string,
    price: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
}

export default PremiumModal
