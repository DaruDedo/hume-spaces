export const mockPayments = () => process.env.COMMERCE_PAYMENT_MODE === 'mock'
  && process.env.NODE_ENV !== 'production';
