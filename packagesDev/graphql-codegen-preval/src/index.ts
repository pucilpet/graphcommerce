/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import { FetchResult } from '@apollo/client'
import { oldVisit, PluginFunction, Types } from '@graphql-codegen/plugin-helpers'
import { LoadedFragment, optimizeOperations } from '@graphql-codegen/visitor-plugin-common'
import fetch from 'cross-fetch'
import {
  ASTNode,
  visit,
  BREAK,
  print,
  DocumentNode,
  concatAST,
  FragmentDefinitionNode,
  Kind,
} from 'graphql'
import { PrevalVisitor } from './PrevalVisitor'

export type StaticQueryPluginConfig = { endpoint: string }

const directiveName = 'static'

function isStaticQuery(document: ASTNode) {
  let is = false
  visit(document, {
    Directive: (node) => {
      if (node.name.value === directiveName) is = true
      return BREAK
    },
  })
  return is
}

function stripDirective(document: DocumentNode, name: string) {
  return visit(document, {
    Directive: (node) => (node.name.value === name ? null : undefined),
  })
}

function assertConfig(
  config: Partial<StaticQueryPluginConfig>,
): asserts config is StaticQueryPluginConfig {
  if (!config.endpoint) {
    throw new Error('You need to provide an endpoint for preval')
  }
}

export const plugin: PluginFunction<
  Partial<StaticQueryPluginConfig>,
  Types.ComplexPluginOutput
> = async (schema, documents, config) => {
  assertConfig(config)

  const appends: string[] = []

  for await (const documentFile of documents) {
    const { document } = documentFile
    if (!document) break
    if (!isStaticQuery(document)) break

    const newDocument = stripDirective(document, directiveName)

    const req = await fetch(config.endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: print(newDocument),
      }),
    })
    const res = (await req.json()) as FetchResult

    if (res.errors) {
      throw Error(
        `Error while resolving static query: ${res.errors.map((e) => e.message).join(', ')} (${
          documentFile.location
        })`,
      )
    }

    if (res.data) {
      const visitor = new PrevalVisitor(schema, res)
      const visitorResult = oldVisit(newDocument, { leave: visitor }) as { definitions: string[] }

      const results = visitorResult.definitions.filter((t) => typeof t === 'string')

      appends.push(...results)
    }

    documentFile.document = newDocument
  }

  return {
    append: appends,
    content: '',
  }
}
