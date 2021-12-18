import * as React from 'react'
// import MainBanner from '../../components/common/home/MainBanner'
import {Box, Divider, Grid, Paper, Typography} from '@mui/material'
import CarouselCard from '../../../components/common/Carousel'
import Link from '@mui/material/Link'
import {Link as RouterLink} from 'react-router-dom'
import ProductImage from "./ProductImage";
import ProductInfo from "./ProductInfo";


const Product = (): JSX.Element => {
    // const productId = props.match.params.productId                                               //get productId

    //get date product from api

    const product = {
        title: 'Fake Title'
    }

    return (
        <>
            <Grid container display='flex' alignItems='center' flexDirection='column'>
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
                    <Grid item xs={6}>
                        <ProductImage product={product}/>
                    </Grid>
                    <Grid item xs={6}>
                        <ProductInfo product={product}/>
                    </Grid>
                </Grid>

                <CarouselCard name={"Sản phẩm tương tự"}/>



                <Grid
                    container
                    marginTop={1}
                    marginBottom={4}
                    spacing={4}
                    justifyContent='between'
                >
                    <Divider/>
                    <Typography gutterBottom variant='h4' component='h5'>
                        Mô tả sản phẩm
                    </Typography>
                    <Typography variant='body1' color='text.secondary'>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </Typography>

                </Grid>

            </Grid>
        </>
    )
}

export default Product
