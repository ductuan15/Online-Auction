import * as React from 'react'
import { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery'

type productDetailProps = {
  product: {
    title: string
    // present_price: number
    // image: string
    // rate: number
    // buy_now_price?: number
    // number_bidder: number
    // date: string
    // time: string
  }
}
const ProductImage = ({ product }: productDetailProps): JSX.Element => {
  const [Images, setImages] = useState([] as any)
  useEffect(() => {
    //get images from props product
    const images = []
    images.push(
      {
        original:
          'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/1.jpg',
        thumbnail:
          'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/1.jpg',
      },
      {
        original:
          'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/1.jpg',
        thumbnail:
          'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/1.jpg',
      },
      {
        original:
          'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/1.jpg',
        thumbnail:
          'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/1.jpg',
      },
      {
        original:
          'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/1.jpg',
        thumbnail:
          'https://raw.githubusercontent.com/xiaolin/react-image-gallery/master/static/1.jpg',
      },
    )
    // console.log(images)
    setImages(images)
  }, [])

  return (
    <>
      <ImageGallery
        infinite
        showNav
        showBullets
        showThumbnails
        showPlayButton={false}
        showFullscreenButton
        items={Images}
      />
    </>
  )
}

export default ProductImage
