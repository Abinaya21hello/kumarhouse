import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, Button, Rating } from '@mui/material';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

const RelatedProductCard = ({ product }) => {
    return (
        <Card>
            <Link to={`/product/${product._id}`}>
                <CardMedia
                    component="img"
                    alt={product.name}
                    height="140"
                    image={product.image}
                    title={product.name}
                />
            </Link>
            <CardContent>
                <Link to={`/product/${product._id}`}>
                    <Typography gutterBottom variant="h5" component="div">
                        {product.name}
                    </Typography>
                </Link>
                <Typography variant="body2" color="textSecondary" component="p">
                    Rs {product.price}
                </Typography>
                <Rating value={product.rating} readOnly />
            </CardContent>
            <Button size="small" color="primary">
                <ShoppingCartOutlinedIcon />
            </Button>
            <Button size="small" color="primary">
                <FavoriteBorderOutlinedIcon />
            </Button>
        </Card>
    );
};

export default RelatedProductCard;
