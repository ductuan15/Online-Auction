import * as React from 'react'
import { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery'
import Product from '../../../data/product'
import './ProductDetail.css'

type productDetailProps = {
  product: Product | undefined
}
const ProductImage = ({ product }: productDetailProps): JSX.Element => {
  const [Images, setImages] = useState([])
  useEffect(() => {
    // console.log(product?.detail)    //log ra undefined => ch có product => làm sao để gọi api xong mới render mn và vì sao Info có product còn bên đây thì ko dù cả 2 render cùng lúc?
    const images = [] as any
    product?.detail.forEach((image) => {
      images.push({
        original: image,
        thumbnail: image,
      })
    })
    // console.log(images)
    setImages(images)
  }, [product])

  return (
    <ImageGallery
      infinite
      showNav
      showBullets
      showThumbnails
      showPlayButton={false}
      showFullscreenButton
      items={Images}
    />
  )
}

export default ProductImage
