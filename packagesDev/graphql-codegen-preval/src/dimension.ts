import { RequestOptions } from 'http'
import { storeToLocale } from '@graphcommerce/magento-store'

type StaticGeneratorProps = {
  operationName: string
  runOperation: (headers: Record<string, string>, variables: Record<string, string>) => Promise<JSON>
  typescriptOperationType: string
  locales: string[]
}

async function generateByStore(props: StaticGeneratorProps) {
  const { operationName, runOperation, typescriptOperationType, locales } = props

  // Create request Record<string, JSON> and run them in parallel
  const requests = locales.map(locale => {
    const headers = {
      'Content-Type': 'application/json',
      'Accept-Language': locale,
    }

    return [locale, runOperation(headers, {})] as const
  })

  // Wait for all requests to finish and map to a Record<string, JSON>

  const responses = await Promise.all(requests);
  

  // Generate function there the locale is passed as a parameter
  return `
    const ${}

    export function ${operationName}(locale: string): ${typescriptOperationType} {
    
  
  `
}
