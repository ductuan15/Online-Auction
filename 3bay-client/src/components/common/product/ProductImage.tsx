import * as React from 'react'
import { useMemo } from 'react'
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery'
import { useProductContext } from '../../../contexts/product/ProductDetailsContext'
import './ProductImage.css'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material'

const ProductImage = (): JSX.Element | null => {
  const theme = useTheme()
  const xsScreen = useMediaQuery(theme.breakpoints.only('xs'))

  const {
    state: { currentProduct: product },
  } = useProductContext()

  const images = useMemo(() => {
    if (!product) {
      return []
    }
    const productsImage: ReactImageGalleryItem[] = []
    // console.log(product)
    productsImage.push({
      original: product?.thumbnails.original || '',
      thumbnail: product?.thumbnails.sm,
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
    return productsImage
  }, [product])

  if (!product) {
    return null
  }

  return (
    <ImageGallery
      infinite
      showNav
      showBullets
      showThumbnails
      showPlayButton={false}
      showFullscreenButton
      items={images}
      thumbnailPosition={xsScreen ? undefined : 'left'}
    />
  )
}

export default ProductImage
