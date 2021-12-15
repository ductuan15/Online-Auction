import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {CardActionArea} from '@mui/material';
import { Rating } from 'react-simple-star-rating'
import {useState, useEffect} from "react";

type CardProps = {
    product: {
        id: number,
        title: string,
        present_price: number,
        image: string,
        rate: number,
        buy_now_price?: number,
        number_bidder: number,
        date: string,
        time: string
    },
}

const CardProduct = ({product}: CardProps): JSX.Element => {

    const [ hours, setHours ] = useState(1);
    const [ minutes, setMinutes ] = useState(0);
    const [ seconds, setSeconds ] =  useState(0);
    let myInterval: any;
    useEffect(()=>{
        myInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    setSeconds(59);
                    setMinutes(59);
                    setHours(hours - 1);
                    if(hours === 0) {
                        clearInterval(myInterval)
                    }
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000)
        return ()=> {
            clearInterval(myInterval);
        };
    });
    return (
        <Card sx={{ maxWidth: 350 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="250px"
                    image={product.image}
                />
                <CardContent>
                    <Typography gutterBottom variant='h5' component='div'>
                        {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        <Rating
                            ratingValue={0}
                            readonly
                            size={15}
                            initialValue={product.rate} />
                        ({product.number_bidder})
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {product.present_price} VND
                        {
                            product.buy_now_price ? <span> to {product.buy_now_price} VND</span> : null
                        }
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        from {product.date}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        { minutes === 0 && seconds === 0
                            ? null
                            : <span> {hours}:{minutes}:{seconds < 10 ?  `0${seconds}` : seconds}</span>
                        }
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
}

export default CardProduct;