import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Cart = ({ cartItems, handleClearCart }) => {
    const [userInfo, setUserInfo] = useState({
        email: '',
        phoneNumber: '',
        city: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePlaceOrder = () => {
        console.log("Placing order:", { userInfo, cartItems });
        handleClearCart();
    };

    return (
        <Box sx={{ p: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ShoppingCartIcon sx={{ mr: 1 }} />
                <Typography variant="h4">Shopping Cart</Typography>
            </Box>
            {cartItems.map((item, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>{item.product.attributes.productTitle}</Typography>
                    <Typography>{item.quantity}</Typography>
                </Box>
            ))}
            <TextField name="email" label="Email" variant="outlined" fullWidth onChange={handleChange} value={userInfo.email} sx={{ mb: 1 }} />
            <TextField name="phoneNumber" label="Phone Number" variant="outlined" fullWidth onChange={handleChange} value={userInfo.phoneNumber} sx={{ mb: 1 }} />
            <TextField name="city" label="City" variant="outlined" fullWidth onChange={handleChange} value={userInfo.city} sx={{ mb: 2 }} />
            <Button onClick={handlePlaceOrder} variant="contained" sx={{ mr: 1 }}>Place Order</Button>
        </Box>
    );
};

export default Cart;
