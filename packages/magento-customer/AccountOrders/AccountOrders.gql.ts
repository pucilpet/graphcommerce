// Do not edit this file: autogenerated by graphql-code-generator
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core'
import * as Types from '@reachdigital/magento-graphql'

import { OrderCardFragment, OrderCardFragmentDoc } from '../OrderCard/OrderCard.gql'

export const AccountOrdersFragmentDoc: DocumentNode<AccountOrdersFragment, unknown> = {
  kind: 'Document',
  definitions: [
    {
      kind: 'FragmentDefinition',
      name: { kind: 'Name', value: 'AccountOrders' },
      typeCondition: { kind: 'NamedType', name: { kind: 'Name', value: 'Customer' } },
      selectionSet: {
        kind: 'SelectionSet',
        selections: [
          {
            kind: 'Field',
            name: { kind: 'Name', value: 'orders' },
            selectionSet: {
              kind: 'SelectionSet',
              selections: [
                {
                  kind: 'Field',
                  name: { kind: 'Name', value: 'items' },
                  selectionSet: {
                    kind: 'SelectionSet',
                    selections: [
                      { kind: 'FragmentSpread', name: { kind: 'Name', value: 'OrderCard' } },
                    ],
                  },
                },
              ],
            },
          },
        ],
      },
    },
    ...OrderCardFragmentDoc.definitions,
  ],
}
export type AccountOrdersFragment = {
  orders?: Types.Maybe<{ items: Array<Types.Maybe<OrderCardFragment>> }>
}