import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Divider } from '@mui/material';
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
                <Box key={index} sx={{ mb: 2 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mb: 1 }}>{item.product.attributes.productTitle}</Typography>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography>{item.quantity}</Typography>
                        <Typography>{item.product.attributes.productPrice * item.quantity} DT</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                </Box>
            ))}
            <Typography variant="h5">Locate yourself to receive the product</Typography>

            <Divider sx={{ my: 2 }} />
            <TextField name="email" label="Email" variant="outlined" fullWidth onChange={handleChange} value={userInfo.email} sx={{ mb: 1 }} />
            <TextField name="phoneNumber" label="Phone Number" variant="outlined" fullWidth onChange={handleChange} value={userInfo.phoneNumber} sx={{ mb: 1 }} />
            <TextField name="city" label="City" variant="outlined" fullWidth onChange={handleChange} value={userInfo.city} sx={{ mb: 2 }} />
            <Button onClick={handlePlaceOrder} variant="contained" sx={{ mr: 1 }}>Place Order</Button>
        </Box>
    );
};

export default Cart;
