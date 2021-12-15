import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import {CardActionArea, Paper} from '@mui/material';

type CardProps = {
    product: {
        id: number,
        title: string,
        price: number,
        image: string
    },
}

const CardProduct = ({product}: CardProps): JSX.Element => {
    return (
        <Paper>
            <Card sx={{ maxWidth: 350 }}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="250px"
                    image={product.image}
                />
                <CardContent>
                    <Typography gutterBottom fontWeight='bold' variant="h5" component="div">
                        {product.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {product.price}
                    </Typography>
                </CardContent>
            </CardActionArea>
            </Card>
        </Paper>
    );
}

export default CardProduct;