import * as React from 'react'
import { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery'
import Product from '../../../data/product'
import './ProductDetail.css'

type productDetailProps = {
  product: Product | undefined
}
// TODO fix later
const ProductImage = ({ product }: productDetailProps): JSX.Element => {
  const [images, setImages] = useState<any[]>([])
  useEffect(() => {
    // console.log(product?.detail)    //log ra undefined => ch có product => làm sao để gọi api xong mới render mn và vì sao Info có product còn bên đây thì ko dù cả 2 render cùng lúc?
    const productsImage: any[] = []
    productsImage.push({
      original: product?.thumbnails.original,
      thumbnail: product?.thumbnails.original,
    })
    if (product?.detail) {
      product?.detail.forEach((image) => {
        productsImage.push({
          original: image,
          thumbnail: image,
        })
      })
    }
    // console.log(images)
    setImages(productsImage)
  }, [product])

  return (
    <ImageGallery
      infinite
      showNav
      showBullets
      showThumbnails
      showPlayButton={false}
      showFullscreenButton
      items={images}
    />
  )
}

export default ProductImage
