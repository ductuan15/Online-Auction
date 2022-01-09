import ProductRowSkeleton from './ProductRowSkeleton'
import ProductCardSkeleton from './ProductCardSkeleton'

type ProductItemProps = {
  cardStyle?: 'row' | 'card'
}

export default function ProductItemSkeleton({
  cardStyle,
}: ProductItemProps): JSX.Element {
  return cardStyle === 'row' ? <ProductRowSkeleton /> : <ProductCardSkeleton />
}
