import * as React from 'react'
import Card from "@mui/material/Card";
import {Button, CardActionArea, Link, Paper, Rating} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
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
const ProductInfo = ({ product }: productDetailProps): JSX.Element => {
    const value = 3
    return (
        <>
            <Paper elevation={0}>
                <Typography gutterBottom variant='h4' component='h4'>
                    Product Title
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                    Giá hiện tại:
                </Typography>
                {/*Giá mua ngay (nếu có)*/}
                <Typography variant='body1' color='text.secondary'>
                    Giá mua ngay:
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                    Người bán: <Link href="#">Link Người bán</Link> (<Rating name="read-only" value={value} readOnly precision={0.5} size={"small"}/>)
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                    Thời gian bắt đầu:
                </Typography>
                <Typography variant='body1' color='text.secondary'>
                    Thời gian kết thúc (để relative Time khi tgian còn 3 ngày):
                </Typography>

            </Paper>
        </>
    )
}

export default ProductInfo
