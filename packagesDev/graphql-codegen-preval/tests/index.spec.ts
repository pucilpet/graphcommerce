import { buildSchema, parse } from 'graphql'
import { plugin } from '../src'

const testSchema = buildSchema(/* GraphQL */ `
  type Avatar {
    id: ID!
    url: String!
  }

  type User {
    id: ID!
    login: String!
    avatar(height: Int!, width: Int!): Avatar
  }

  type Query {
    user: User!
    users: [User!]!
  }
`)

it('it generates a prevalled query', async () => {
  const testDocument = parse(/* GraphQL */ `
    query StoreConfig @static {
      storeConfig {
        base_url
        absolute_footer
      }
    }
  `)

  const res = await plugin(testSchema, [{ document: testDocument }], {
    endpoint: 'https://backend.reachdigital.dev/graphql',
  })

  expect(res.append?.join('\n')).toMatchSnapshot()
})
