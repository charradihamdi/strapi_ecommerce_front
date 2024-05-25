// ProductDetails.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const ProductDetails = ({ clickedProduct }) => {
    return (
        <Box>
            <Typography variant="h4">{clickedProduct.attributes.productTitle}</Typography>
            <Typography variant="h6">Price: DT{clickedProduct.attributes.productPrice}</Typography>
            <Typography variant="body1">{clickedProduct.attributes.productDescription}</Typography>
            <Typography variant="subtitle1">Quantity: {clickedProduct.attributes.productQuantity}</Typography>
        </Box>
    );
};

export default ProductDetails;
