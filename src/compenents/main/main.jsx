// Main.js
import { AddShoppingCartOutlined, Close } from '@mui/icons-material';
import { Box, Button, Card, CardActions, CardContent, CardMedia, CircularProgress, Container, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Rating, Stack, ToggleButton, ToggleButtonGroup, Typography, useTheme } from '@mui/material';
import React from "react";
import ProductDetails from './ProductDetails';
import { useGetProductByNameQuery } from '../../Redux/product';
import { useState } from 'react';
import { AnimatePresence, motion } from "framer-motion";

const Main = () => {
    const handleAlignment = (event, newValue) => {
        if (newValue !== null) {
            setmyDate(newValue);
        }
    };
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => { setOpen(true); };
    const handleClose = () => { setOpen(false); };

    const allProductsAPI = "products?populate=*";
    const womenCategoryAPI = "products?populate=*&filters[productCategory][$eq]=Women";
    const manCategoryAPI = "products?populate=*&filters[productCategory][$eq]=Man";

    const [myDate, setmyDate] = useState(allProductsAPI);
    const { data, error, isLoading } = useGetProductByNameQuery(myDate);
    const [clickedProduct, setclickedProduct] = useState({});

    if (isLoading) {
        return (
            <Box sx={{ textAlign: "center", py: 11 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Container sx={{ py: 11, textAlign: "center" }}>
                <Typography variant="h6">
                    {error.error}
                </Typography>
                <Typography variant="h6">
                    please try again
                </Typography>
            </Container>
        );
    }

    if (data) {
        return (
            <Container sx={{ py: 9 }}>
                <Stack
                    direction={"row"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    flexWrap={"wrap"}
                    gap={3}>
                    <Box>
                        <Typography variant="h6">Selected Products </Typography>
                        <Typography fontWeight={300} variant="body1">
                            All our new arrivals in an exclusive brand selection
                        </Typography>
                    </Box>
                    <ToggleButtonGroup
                        color="error"
                        value={myDate}
                        exclusive
                        onChange={handleAlignment}
                        aria-label="text alignment"
                        sx={{
                            ".Mui-selected": {
                                border: "1px solid rgba(233,69,96,0.5) !important ",
                                color: "#e94560",
                                backgroundColor: "initial",
                            },
                        }}>
                        <ToggleButton
                            sx={{ color: theme.palette.text.primary }}
                            className="myButton" value={allProductsAPI} aria-label="left aligned">
                            All Products
                        </ToggleButton>
                        <ToggleButton sx={{ mx: "16px !important", color: theme.palette.text.primary }} className="myButton" value={manCategoryAPI} aria-label="centered">
                            Men Category
                        </ToggleButton>
                        <ToggleButton
                            sx={{ color: theme.palette.text.primary }}
                            className="myButton" value={womenCategoryAPI} aria-label="right aligned">
                            Women Category
                        </ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
                <Stack direction={"row"}
                    flexWrap={"wrap"}
                    justifyContent={"space-between"}>
                    <AnimatePresence>
                        {data.data.map((item) => {
                            return (
                                <Card
                                    component={motion.section}
                                    layout
                                    initial={{ transform: "scale(0)" }}
                                    animate={{ transform: "scale(1)" }}
                                    transition={{ duration: 1.6, type: "spring", stiffness: 50 }}
                                    key={item.id}
                                    sx={{
                                        maxWidth: 333,
                                        mt: 6,
                                        ":hover .MuiCardMedia-root": { rotate: "1deg", scale: "1.1", transition: "0.35s" },
                                    }}>
                                    <CardMedia sx={{ height: 277 }}
                                        image={`${item.attributes.productImg.data[0].attributes.url}`}
                                        title="green iguara" />
                                    <CardContent>
                                        <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                            <Typography gutterBottom variant="h6" component="div">{item.attributes.productTitle}</Typography>
                                            <Typography variant="subtitle1" component="p"> DT{item.attributes.productPrice}</Typography>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary">{item.attributes.productDescription}</Typography>
                                    </CardContent>
                                    <CardActions sx={{ justifyContent: "space-between" }}>
                                        <Button onClick={() => {
                                            handleClickOpen();
                                            setclickedProduct(item);
                                        }}
                                            sx={{ textTransform: "capitalize" }} size="large">
                                            <AddShoppingCartOutlined sx={{ mr: 1 }} fontSize='small' />
                                            add to cart
                                        </Button>
                                        <Rating precision={0.1} name="read-only" value={item.attributes.productRating} readOnly />
                                    </CardActions>
                                </Card>
                            );
                        })}
                    </AnimatePresence>
                </Stack>
                <Dialog
                    sx={{ ".MuiPaper-root": { minWidth: { xs: "100%", md: 800 } } }}
                    open={open}
                    onClose={handleClose}
                    aria-labelledby='alert-dialog-title'
                    aria-describedby='alert-dialog-description'>
                    <IconButton sx={{
                        ":hover": { color: "red", rotate: "180deg", transition: "0.3s" },
                        position: "absolute",
                        top: 0, right: 10
                    }}
                        onClick={handleClose}>
                        <Close />
                    </IconButton>
                    <ProductDetails clickedProduct={clickedProduct} />
                </Dialog>
            </Container>
        );
    }
};

export default Main;
