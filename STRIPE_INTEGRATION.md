# Stripe Integration Guide

## Overview
This document provides instructions for setting up and using the Stripe payment integration in the UniFi-FE application.

## Setup Instructions

### 1. Environment Configuration

Add your Stripe publishable key to your environment file:

```env
# For development (.env.development)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_test_publishable_key_here

# For production (.env.production)
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key_here
```

### 2. Backend Requirements

Your backend API needs to implement the following endpoints:

#### `/payment-api/create-payment-intent`
- **Method**: POST
- **Body**: 
  ```json
  {
    "amount": 1000,  // Amount in cents
    "currency": "usd",
    "description": "Course Purchase: React Mastery",
    "metadata": {...}
  }
  ```
- **Response**: 
  ```json
  {
    "clientSecret": "pi_xxx_secret_xxx",
    "paymentIntentId": "pi_xxx"
  }
  ```

#### `/payment-api/process-education-payment`
- **Method**: POST
- **Body**: 
  ```json
  {
    "paymentMethodId": "pm_xxx",
    "amount": 1000,
    "currency": "usd",
    "email": "user@example.com",
    "courseId": "course_123",
    "billingDetails": {...}
  }
  ```
- **Response**: 
  ```json
  {
    "success": true,
    "requiresAction": false,
    "clientSecret": "pi_xxx_secret_xxx"
  }
  ```

### 3. Backend Implementation (Node.js Example)

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Create payment intent
app.post('/payment-api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, description, metadata } = req.body;
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });
    
    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Process education payment
app.post('/payment-api/process-education-payment', async (req, res) => {
  try {
    const { paymentMethodId, amount, currency, email, metadata } = req.body;
    
    // Create payment intent with payment method
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      receipt_email: email,
      metadata,
      confirm: true,
      automatic_payment_methods: {
        enabled: true,
        allow_redirects: 'never'
      },
    });
    
    // Check if 3D Secure is required
    if (paymentIntent.status === 'requires_action') {
      res.json({
        success: false,
        requiresAction: true,
        clientSecret: paymentIntent.client_secret
      });
    } else if (paymentIntent.status === 'succeeded') {
      // Payment successful - update your database here
      res.json({
        success: true,
        requiresAction: false
      });
    } else {
      res.json({
        success: false,
        message: 'Payment failed'
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Testing

### Test Cards
Use these test card numbers in development mode:

- **Successful payment**: 4242 4242 4242 4242
- **Requires authentication**: 4000 0025 0000 3155
- **Declined**: 4000 0000 0000 0002
- **Insufficient funds**: 4000 0000 0000 9995

Use any future expiry date (e.g., 12/34) and any 3-digit CVC.

### Testing the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to a course or webinar that requires payment

3. Click on the purchase/subscribe button

4. In the payment modal:
   - Enter test card details
   - Fill in billing information
   - Click "Pay Now"

5. Verify:
   - Payment processes successfully
   - 3D Secure authentication works (with test card 4000 0025 0000 3155)
   - Error handling works (with declined card)

## Security Considerations

1. **Never expose your Secret Key**: The secret key should only be on your backend server
2. **Use HTTPS**: Always use HTTPS in production
3. **Validate amounts**: Always calculate payment amounts on the server
4. **Implement webhooks**: Set up Stripe webhooks to handle payment confirmations
5. **PCI Compliance**: Using Stripe Elements ensures PCI compliance

## Component Structure

### Key Components

1. **StripeProvider** (`/src/contexts/StripeContext.jsx`)
   - Initializes Stripe and provides it to child components
   - Wraps the payment modal

2. **StripePaymentForm** (`/src/shared/components/layout/premium/stripe-payment-form/index.jsx`)
   - Collects card details using Stripe Elements
   - Creates payment method

3. **ReviewEducation** (`/src/shared/components/layout/premium/review-education/index.jsx`)
   - Processes the payment
   - Handles 3D Secure authentication
   - Shows payment confirmation

4. **Stripe Service** (`/src/services/stripe.js`)
   - RTK Query API endpoints for Stripe operations

## Troubleshooting

### Common Issues

1. **"Stripe is not loaded"**
   - Check that VITE_STRIPE_PUBLISHABLE_KEY is set in your .env file
   - Ensure the key starts with `pk_test_` for test mode

2. **Payment fails with "Invalid API Key"**
   - Verify your publishable key is correct
   - Check that backend is using the corresponding secret key

3. **3D Secure not working**
   - Ensure you're handling the `requiresAction` response
   - Use the test card 4000 0025 0000 3155 to test 3D Secure

4. **CORS errors**
   - Configure your backend to allow requests from your frontend domain
   - Add proper CORS headers for Stripe webhooks

## Support

For Stripe-specific issues:
- [Stripe Documentation](https://stripe.com/docs)
- [Stripe Support](https://support.stripe.com)

For implementation issues:
- Check the browser console for errors
- Verify network requests in browser DevTools
- Ensure all environment variables are set correctly