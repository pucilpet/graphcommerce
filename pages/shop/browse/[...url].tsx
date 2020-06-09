import React from 'react'
import ShopLayout, { PageWithShopLayout, ShopLayoutProps } from 'shop/venia-ui/ShopLayout'
import getNavigationProps from 'shop/venia-ui/ShopLayout/getNavigationProps'
import { GetStaticProps, GetStaticPaths } from 'next'
import getUrlResolveProps from 'shop/venia-ui/ShopLayout/getUrlResolveProps'
import getCategoryPageProps, {
  GetCategoryPageProps,
} from 'shop/venia-ui/RootComponents/CategoryPage/getCategoryPageProps'
import CategoryPage from 'shop/venia-ui/RootComponents/CategoryPage'

const PageWithLayout: PageWithShopLayout<GetCategoryPageProps> = (props) => {
  return <CategoryPage {...props} />
}
PageWithLayout.layout = ShopLayout

export default PageWithLayout

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [{ params: { url: ['venia-bottoms'] } }],
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps<
  ShopLayoutProps & GetCategoryPageProps,
  { url: [string] }
> = async (ctx) => {
  if (!ctx.params) throw Error('No params')
  const variables = await getUrlResolveProps({ urlKey: `${ctx.params.url.join('/')}.html` })
  const data = await Promise.all([
    getNavigationProps(variables),
    getCategoryPageProps({
      ...variables,
      currentPage: 1,
      pageSize: 10,
      onServer: true,
      filters: {
        category_id: { eq: String(variables.id) },
      },
      sort: {},
    }),
  ])
  return { props: { ...variables, ...Object.assign(...data) } }
}