/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import { FetchResult } from '@apollo/client'
import { ClientSideBaseVisitor, DocumentMode } from '@graphql-codegen/visitor-plugin-common'
import { pascalCase } from 'change-case-all'
import { OperationDefinitionNode, GraphQLSchema } from 'graphql'

export class PrevalVisitor extends ClientSideBaseVisitor {
  constructor(schema: GraphQLSchema, protected fetchResult: FetchResult) {
    super(schema, [], {}, { documentVariableSuffix: '' }, [])
  }

  OperationDefinition(node: OperationDefinitionNode): string {
    this._collectedOperations.push(node)

    const documentVariableName = this.getOperationVariableName(node)

    const operationType: string = pascalCase(node.operation)
    const operationTypeSuffix: string = this.getOperationSuffix(node, operationType)

    const operationResultType: string = this.convertName(node, {
      suffix: operationTypeSuffix + this._parsedConfig.operationResultSuffix,
    })
    const operationVariablesTypes: string = this.convertName(node, {
      suffix: `${operationTypeSuffix}Variables`,
    })

    let documentString = ''
    if (this.config.documentMode !== DocumentMode.external) {
      // only generate exports for named queries
      if (documentVariableName !== '') {
        documentString = `${
          this.config.noExport ? '' : 'export'
        } const ${documentVariableName}: ${operationResultType} =${
          this.config.pureMagicComment ? ' /*#__PURE__*/' : ''
        } ${JSON.stringify(this.fetchResult.data)};`
      }
    }

    const hasRequiredVariables = this.checkVariablesRequirements(node)

    const additional = this.buildOperation(
      node,
      documentVariableName,
      operationType,
      operationResultType,
      operationVariablesTypes,
      hasRequiredVariables,
    )

    return [documentString, additional].filter((a) => a).join('\n')
  }
}
