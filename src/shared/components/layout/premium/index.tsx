import { useState, forwardRef } from 'react'
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  useTheme,
  Divider,
  Typography,
  type StepIconProps,
} from '@mui/material'
import { CreditCard, MapPin, ShoppingCart, CheckCircle } from 'lucide-react'

import AddNewCard from './add-new-card'
import BillingAddress from './billing-adress'
import ReviewEducation from './review-education'
import ModalBox from '../../ui-elements/modal-box'

interface PurchaseDetails {
  _id: string
  name: string
  price: number
  purchaseType: string
  displayName: string
}

interface PremiumModalRef {
  openModal: () => void
  closeModal: () => void
}

interface PremiumModalProps {
  purchaseDetails: PurchaseDetails
}

const PremiumModal = forwardRef<PremiumModalRef, PremiumModalProps>(
  ({ purchaseDetails }, ref) => {
    const [currentStep, setCurrentStep] = useState(0)
    const [subscriptionFormData, setSubscriptionFormData] = useState({})
    const theme = useTheme()

    const steps = [
      { label: 'Payment Details', icon: CreditCard },
      { label: 'Billing Address', icon: MapPin },
      { label: 'Review Order', icon: ShoppingCart },
    ]

    const CustomStepIcon = (props: StepIconProps & { iconComponent: any }) => {
      const { active, completed, iconComponent: Icon } = props

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
              setCurrentStep={setCurrentStep}
              transactionInfo={subscriptionFormData}
              closeModal={closeModal}
              purchaseDetails={purchaseDetails}
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
                ? `Purchase access to ${purchaseDetails?.displayName || 'this course'}`
                : purchaseDetails?.purchaseType === 'WEBINAR'
                  ? `Register for ${purchaseDetails?.displayName || 'this webinar'}`
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
                  <StepLabel
                    StepIconComponent={(props) => (
                      <CustomStepIcon {...props} iconComponent={step.icon} />
                    )}
                  >
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
  },
)

PremiumModal.displayName = 'PremiumModal'

export default PremiumModal
