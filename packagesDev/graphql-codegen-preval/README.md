# GraphQL Codegen Static

Allows you to load the results from GraphQL queries in generated typescript
files. This allows moving query results from **runtime** to **buildtime**.
Classically you have to run a query in `getStaticProps` and then pass the result
to client. Now you can use the results directly, without having to run the
query.

```graphql
query StoreConfigTest @staticGenerator("@graphcommerce/magento-store/generateByStore") {
  myStoreConfig: storeConfig {
    base_url
    product_reviews_enabled
  }
}
```

## Dimensions

To us the generated you need to provide a dimension.

Will generate:

```

Dimensions

```
