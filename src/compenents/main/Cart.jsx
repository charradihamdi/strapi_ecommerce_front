import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, TextField, Divider, Alert } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';

const Cart = ({ cartItems, handleUserInformationSubmit }) => {
    const [userInfo, setUserInfo] = useState({
        email: '',
        phoneNumber: '',
        city: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        // Retrieve existing user information from local storage
        const storedOrderData = localStorage.getItem('orderData');
        if (storedOrderData) {
            const parsedOrderData = JSON.parse(storedOrderData);
            setUserInfo(parsedOrderData.user);
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handlePlaceOrder = async () => {
        if (!userInfo.email || !userInfo.phoneNumber || !userInfo.city) {
            setError('All fields are required.');
            return;
        }

        setError(''); // Clear any previous errors

        // Retrieve existing order data from local storage if it exists
        let existingOrderData = localStorage.getItem('orderData');
        let orderData;

        if (existingOrderData) {
            existingOrderData = JSON.parse(existingOrderData);
            // Merge existing items with new items
            const existingItems = existingOrderData.items;
            const newItems = cartItems.map(item => ({
                productId: item.product.id,
                quantity: item.quantity,
                totalPrice: (item.product.attributes.productPrice * item.quantity).toFixed(2)
            }));

            newItems.forEach(newItem => {
                const existingItem = existingItems.find(item => item.productId === newItem.productId);
                if (existingItem) {
                    existingItem.quantity += newItem.quantity;
                    existingItem.totalPrice = (parseFloat(existingItem.totalPrice) + parseFloat(newItem.totalPrice)).toFixed(2);
                } else {
                    existingItems.push(newItem);
                }
            });

            orderData = {
                user: userInfo,
                items: existingItems
            };
        } else {
            orderData = {
                user: userInfo,
                items: cartItems.map(item => ({
                    productId: item.product,
                    quantity: item.quantity,
                    totalPrice: (item.product.attributes.productPrice * item.quantity).toFixed(2)
                }))
            };
        }

        localStorage.setItem('orderData', JSON.stringify(orderData));
        window.location.reload();
        try {
            const response = await axios.post('http://localhost:1337/orders', orderData);
            if (response.status === 201) {
                console.log('Order placed successfully:', response.data);
                handleUserInformationSubmit();
            } else {
                console.error('Failed to place order:', response.statusText);
            }
        } catch (error) {
            console.error('Error placing order:', error);
            window.location.reload();
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
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <Button onClick={handlePlaceOrder} variant="contained" sx={{ mr: 1 }}>Place Order</Button>
        </Box>
    );
};

export default Cart;
