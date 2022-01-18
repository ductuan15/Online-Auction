import ProductRowSkeleton from '../product-row/ProductRowSkeleton'
import ProductCardSkeleton from '../product-card/ProductCardSkeleton'

type ProductItemProps = {
  cardStyle?: 'row' | 'card'
}

export default function ProductItemSkeleton({
  cardStyle,
}: ProductItemProps): JSX.Element {
  return cardStyle === 'row' ? <ProductRowSkeleton /> : <ProductCardSkeleton />
}
