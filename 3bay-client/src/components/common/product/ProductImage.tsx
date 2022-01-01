import * as React from 'react'
import { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery'
import Product from '../../../models/product'

type productDetailProps = {
  product: Product | undefined
}

const ProductImage = ({ product }: productDetailProps): JSX.Element => {
  const [images, setImages] = useState<any[]>([])
  useEffect(() => {

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
      thumbnailPosition={'left'}
    />
  )
}

export default ProductImage
