import React from 'react'
import { PaymentOptionsProps } from '@graphcommerce/magento-cart-payment-method'
import MollieIssuerOptions from './MollieIssuerOptions'

export default function MollieIdealOptions(props: PaymentOptionsProps) {
  return <MollieIssuerOptions label='Choose your bank' {...props} />
}