import React, { useState, forwardRef } from 'react'

import AddNewCard from './add-new-card'
import BillingAddress from './billing-adress'
import ReviewEducation from './review-education'
import EducationPremium from './education-premium'
import ModalBox from '../../ui-elements/modal-box'

interface PurchaseDetails {
  features: string[]
  duration: string
  key: string
  _id: string
  name: string
  price: number
  purchaseType: string
  displayName: string
  description: string
  scheduledDate?: string
}

interface MediaDetails {
  logo: string
  coverImage: string
  featureImage: string
  educatorDetails: string
}

interface PremiumModalProps {
  subscriptionDetails: PurchaseDetails[]
  mediaDetails: MediaDetails
  isEducation?: boolean
}

interface PremiumModalRef {
  openModal: () => void
  closeModal: () => void
}

const PremiumModal = forwardRef<PremiumModalRef, PremiumModalProps>(
  ({ subscriptionDetails, mediaDetails }, ref) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [subscriptionFormData, setSubscriptionFormData] = useState({})

    const resetModal = () => {
      setCurrentStep(1)
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
        case 1:
          return (
            <EducationPremium
              mediaDetails={mediaDetails}
              subscriptionDetails={subscriptionDetails}
              setCurrentStep={setCurrentStep}
            />
          )
        case 2:
          return (
            <AddNewCard
              setCurrentStep={setCurrentStep}
              setSubscriptionFormData={setSubscriptionFormData}
              subscriptionFormData={subscriptionFormData}
            />
          )
        case 3:
          return (
            <BillingAddress
              setCurrentStep={setCurrentStep}
              setSubscriptionFormData={setSubscriptionFormData}
              subscriptionFormData={subscriptionFormData}
            />
          )
        case 4:
          return (
            <ReviewEducation
              setCurrentStep={setCurrentStep}
              transactionInfo={subscriptionFormData}
              closeModal={closeModal}
              subscriptionDetails={subscriptionDetails}
            />
          )
        default:
          return null
      }
    }

    return (
      <ModalBox
        ref={ref}
        title={null}
        isBackdropAllowed={false}
        size={currentStep === 1 ? 'xs' : 'sm'}
        disablePadding
        onCloseModal={() => {
          resetModal()
          if (ref && 'current' in ref && ref.current) {
            ref.current.closeModal()
          }
        }}
      >
        {renderStepContent()}
      </ModalBox>
    )
  },
)

PremiumModal.displayName = 'PremiumModal'

export default PremiumModal
