// OrderList.js
import React from 'react';
import { Box, Typography } from '@mui/material';

const OrderList = ({ orders }) => {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" mb={2}>Orders</Typography>
            {orders.map((order, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="h6">{order.product.attributes.productTitle}</Typography>
                    <Typography>Quantity: {order.quantity}</Typography>
                    {/* Add more details like email, phone number, etc. from the order */}
                </Box>
            ))}
        </Box>
    );
};

export default OrderList;
