import React, { useState } from 'react';
import { Box, Typography, Button, Stack, ToggleButton, ToggleButtonGroup, IconButton } from '@mui/material';
import { AddShoppingCartOutlined, Add, Remove } from '@mui/icons-material';
import Cart from './Cart'; // Import the Cart component

const ProductDetails = ({ clickedProduct }) => {
    const [selectedImg, setSelectedImg] = useState(0);
    const [quantity, setQuantity] = useState(1);
    const [showCart, setShowCart] = useState(false);
    const [cartItems, setCartItems] = useState([]);

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
        setShowCart(true);
    };

    const handleClearCart = () => {
        setCartItems([]);
        setShowCart(false);
    };

    return (
        <Box sx={{ display: "flex", alignItems: "center", gap: 2.5, flexDirection: { xs: "column", sm: "row" } }}>
            {showCart ? (
                <Cart cartItems={cartItems} handleClearCart={handleClearCart} />
            ) : (
                <>
                    <Box sx={{ display: "flex" }}>
                        <img width={360} src={clickedProduct.attributes.productImg.data[selectedImg].attributes.url} alt="" />
                    </Box>
                    <Box sx={{ py: 2, textAlign: { xs: "center", sm: "left" } }}>
                        <Typography variant="h5">{clickedProduct.attributes.productTitle}</Typography>
                        <Typography my={0.4} fontSize={"22px"} color={"crimson"} variant="body1">{clickedProduct.attributes.productPrice}DT</Typography>
                        <Typography variant="body1">{clickedProduct.attributes.productDescription}</Typography>
                        <Stack sx={{ justifyContent: { xs: "center", sm: "left" } }} direction={"row"} gap={1} my={2}>
                            <ToggleButtonGroup
                                value={selectedImg}
                                exclusive
                                sx={{
                                    ".Mui-selected": {
                                        border: "1px solid royalblue !important",
                                        borderRadius: "5px !important",
                                        opacity: "1",
                                        backgroundColor: "initial",
                                    },
                                }}>
                                {clickedProduct.attributes.productImg.data.map((item, index) => {
                                    return (
                                        <ToggleButton key={item.id} value={index} sx={{
                                            width: "110px",
                                            height: "110px",
                                            mx: 1,
                                            p: 0,
                                            opacity: "0.5",
                                        }}>
                                            <img
                                                onClick={() => setSelectedImg(index)}
                                                style={{ borderRadius: 3 }} height={"100%"} width={"100%"} src={item.attributes.url} alt="" />
                                        </ToggleButton>
                                    );
                                })}
                            </ToggleButtonGroup>
                        </Stack>

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
                    </Box>
                </>
            )}
        </Box>
    );
};

export default ProductDetails;
