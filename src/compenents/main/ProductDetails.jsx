import React, { useState } from 'react';
import { Box, Typography, Button, Stack, ToggleButton, ToggleButtonGroup, IconButton, Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { AddShoppingCartOutlined, Add, Remove, Close } from '@mui/icons-material';
import Cart from './Cart'; // Import the Cart component

const ProductDetails = ({ clickedProduct, handleCloseProductModal, handleFinishShopping }) => {
    const [selectedImg, setSelectedImg] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [cartItems, setCartItems] = useState([]);
    const [currentStep, setCurrentStep] = useState(1); // State to manage the current step
    const [userInfo, setUserInfo] = useState({ name: '', email: '', city: '' });

    const handleIncrement = () => {
        setQuantity(quantity + 1);
    };

    const handleDecrement = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleAddToCart = () => {
        const updatedCartItems = [...cartItems, { product: clickedProduct, quantity }];
        setCartItems(updatedCartItems);
        setCurrentStep(2); // Move to the next step after adding to cart
    };

    const handleOpenUserInformationPopup = () => {
        setCurrentStep(3);
    };

    const handleCloseUserInformationPopup = () => {
        setCurrentStep(2);
    };

    const handleUserInformationSubmit = () => {
        setCurrentStep(1); // Move back to the first step
        setUserInfo({ name: '', email: '', city: '' }); // Reset user information
        setCartItems([]); // Clear cart items
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, flexDirection: { xs: "column", sm: "row" } }}>
            <Box sx={{ display: "flex" }}>
                <img width={360} src={clickedProduct.attributes.productImg.data[selectedImg].attributes.url} alt="" />
            </Box>
            <Box sx={{ py: 2, textAlign: { xs: "center", sm: "left" } }}>
                {currentStep === 1 && (
                    <>
                        <Typography variant="h5">{clickedProduct.attributes.productTitle}</Typography>
                        <Typography my={0.4} fontSize={"22px"} color={"crimson"} variant="body1">{clickedProduct.attributes.productPrice}DT</Typography>
                        <Typography variant="body1">{clickedProduct.attributes.productDescription}</Typography>
                        {/* Add additional fields or prompts for product information */}
                        <Stack direction="row" alignItems="center" gap={1} my={2}>
                            <IconButton onClick={handleDecrement}>
                                <Remove />
                            </IconButton>
                            <Typography variant="h6">{quantity}</Typography>
                            <IconButton onClick={handleIncrement}>
                                <Add />
                            </IconButton>
                        </Stack>
                        <Button
                            sx={{ mb: { xs: 1, sm: 0 }, textTransform: "capitalize" }}
                            variant="contained"
                            onClick={handleAddToCart}
                        >
                            <AddShoppingCartOutlined sx={{ mr: 1 }} fontSize='small' />add to cart
                        </Button>
                    </>
                )}
                {currentStep === 2 && (
                    <Dialog open={cartItems.length > 0} onClose={handleCloseProductModal}>
                        <DialogTitle>Confirm Your Purchase</DialogTitle>
                        <DialogContent>
                            <Typography variant="body1">Product: {clickedProduct.attributes.productTitle}</Typography>
                            <Typography variant="body1">Price per Item: {clickedProduct.attributes.productPrice} DT</Typography>
                            <Typography variant="body1">Quantity: {quantity}</Typography>
                            <Typography variant="body1">Total Price: {clickedProduct.attributes.productPrice * quantity} DT</Typography>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleOpenUserInformationPopup}>Proceed to Checkout</Button>
                        </DialogActions>
                    </Dialog>
                )}
                {currentStep === 3 && (
                    <Cart cartItems={cartItems} />
                )}
            </Box>
        </Box>
    );
};

export default ProductDetails;
