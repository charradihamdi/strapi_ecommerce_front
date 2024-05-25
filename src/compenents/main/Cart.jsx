import React, { useState } from 'react';
import { Box, Typography, Button, TextField, Divider } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

const Cart = ({ cartItems, handleUserInformationSubmit }) => {
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

    const handlePlaceOrder = async () => {
        const orderData = {
            user: userInfo,
            items: cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                totalPrice: (item.product.attributes.productPrice * item.quantity).toFixed(2)
            }))
        };

        try {
            const response = await fetch('http://localhost:1337/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Order placed successfully:', result);
                localStorage.setItem('orderData', JSON.stringify(orderData));
                handleUserInformationSubmit();
            } else {
                console.error('Failed to place order:', response.statusText);
            }
        } catch (error) {
            console.error('Error placing order:', error);
        }
    };

    const calculateTotalPrice = () => {
        return cartItems.reduce((total, item) => {
            return total + item.product.attributes.productPrice * item.quantity;
        }, 0).toFixed(2);
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
                        <Typography>{"Qte : " + item.quantity}</Typography>
                        <Typography>{"Total price :" + (item.product.attributes.productPrice * item.quantity).toFixed(2)} DT</Typography>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                </Box>
            ))}
            <Typography variant="h5">Localize yourself to obtain the product</Typography>

            <Divider sx={{ my: 2 }} />
            <TextField name="email" label="Email" variant="outlined" fullWidth onChange={handleChange} value={userInfo.email} sx={{ mb: 1 }} />
            <TextField name="phoneNumber" label="Phone Number" variant="outlined" fullWidth onChange={handleChange} value={userInfo.phoneNumber} sx={{ mb: 1 }} />
            <TextField name="city" label="City" variant="outlined" fullWidth onChange={handleChange} value={userInfo.city} sx={{ mb: 2 }} />
            <Button onClick={handlePlaceOrder} variant="contained" sx={{ mr: 1 }}>Place Order</Button>
        </Box>
    );
};

export default Cart;
