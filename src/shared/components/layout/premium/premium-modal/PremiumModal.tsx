import React, { useState, forwardRef } from 'react'

import AddNewCard from './AddNewCard'
import BillingAddress from './BillingAddress'
import ReviewEducation from './ReviewEducation'
import EducationPremium from './EducationPremium'
import ModalBox from '../../../../components/ui-elements/modal-box'

const PremiumModal = forwardRef(
  ({ subscriptionDetails, mediaDetails }, ref) => {
    const [currentStep, setCurrentStep] = useState(1)
    const [subscriptionFormData, setSubscriptionFormData] = useState({})

    const resetModal = () => {
      setCurrentStep(1)
      setSubscriptionFormData({})
    }

    const closeModal = () => {
      ref.current?.closeModal()
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
          ref?.current?.closeModal()
        }}
      >
        {renderStepContent()}
      </ModalBox>
    )
  },
)

export default PremiumModal
