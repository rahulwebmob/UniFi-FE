// Admin API Types

// Authentication Types
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  message: string
  data?: {
    token: string
    user: {
      id: string
      email: string
      firstName?: string
      lastName?: string
      role?: string
    }
  }
}

// OAuth Login Types
export interface OAuthLoginRequest {
  provider: 'google' | 'facebook' | 'apple'
  token: string
  email?: string
  name?: string
}

export interface OAuthLoginResponse extends LoginResponse {}

// Logout Types
export interface LogoutRequest {
  token?: string
}

export interface LogoutResponse {
  success: boolean
  message: string
}

// SignUp Types
export interface SignUpRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phoneNumber?: string
  acceptTerms?: boolean
}

export interface SignUpResponse {
  success: boolean
  message: string
  data?: {
    userId: string
    email: string
    token?: string
  }
}

// User Query Types
export interface LoggedUserResponse {
  success: boolean
  data: {
    id: string
    email: string
    firstName: string
    lastName: string
    phoneNumber?: string
    profilePicture?: string
    role: string
    isEmailVerified: boolean
    isPremium?: boolean
    createdAt?: string
    updatedAt?: string
  }
}

// Premium Subscription Types
export interface BuyPremiumSubscriptionRequest {
  planId: string
  subscriptionType: 'COURSE' | 'WEBINAR' | 'PREMIUM'
  
  // Payment Information
  nameOnCard?: string
  cardNumber?: string
  expDate?: string
  cardCode?: string
  
  // Billing Information
  firstName?: string
  lastName?: string
  country?: string
  state?: string
  city?: string
  zip?: string
  address?: string
  isAgree?: boolean
  
  // Content-specific IDs
  courseId?: string
  webinarId?: string
  scheduledDate?: string
}

export interface BuyPremiumSubscriptionResponse {
  success: boolean
  message: string
  data?: {
    transactionId: string
    subscriptionId: string
    status: string
  }
}