import { CountryCodeEnum } from '@reachdigital/graphql'
import AddressSingleLine from '@reachdigital/magento-customer/AddressSingleLine'
import { CountryRegionsQuery } from '@reachdigital/magento-store'
import React from 'react'
import { CartAddressFragment } from '../CartAddress/CartAddress.gql'

type CartAddressSingleLineProps = CartAddressFragment &
  CountryRegionsQuery & { locale?: CountryCodeEnum }

export default function CartAddressSingleLine(props: CartAddressSingleLineProps) {
  const { countries, locale } = props
  return <AddressSingleLine {...props} country_code={locale} countries={countries} />
}