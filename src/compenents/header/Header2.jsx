import React, { useState, useEffect } from "react";
import { Container, IconButton, Stack, Typography, Popover, Box, Divider, Badge, Tooltip, Button, Paper, Grid } from "@mui/material";
import { ShoppingCartOutlined } from "@mui/icons-material";
import Person2OutlinedIcon from '@mui/icons-material/Person2Outlined';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import axios from 'axios';

const Header2 = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [orderData, setOrderData] = useState(null);
    const [existingOrder, setExistingOrder] = useState([]);
    const [localOrderData, setLocalOrderData] = useState(null);

    useEffect(() => {
        // Retrieve local order data from local storage when component mounts
        const storedLocalOrderData = localStorage.getItem('orderData');
        if (storedLocalOrderData) {
            setLocalOrderData(JSON.parse(storedLocalOrderData));
        }
    }, []);

    useEffect(() => {
        // Fetch order data from server if user email is available
        const fetchOrderData = async () => {
            try {
                const email = localOrderData?.user?.email; // Get email from localOrderData
                if (email) {
                    const response = await axios.get(`http://localhost:5555/api/baskets/email/${email}`);
                    if (response.data) {
                        setExistingOrder(response.data);
                    }
                }
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };

        if (localOrderData) {
            fetchOrderData();
        }
    }, [localOrderData]); // Dependency array ensures fetchOrderData is called after localOrderData is set

    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
        setPopoverOpen(true);
    };

    const handlePopoverClose = () => {
        setPopoverOpen(false);
    };

    const handleOrderSubmit = async () => {
        if (!localOrderData || !localOrderData.items || localOrderData.items.length === 0) {
            console.error('No local orders to submit');
            return;
        }

        const totalPrice = localOrderData.items.reduce((sum, item) => sum + parseFloat(item.totalPrice), 0);

        const data = {
            username: 'zear',
            email: localOrderData.user.email, // Use actual email from localOrderData
            phone: localOrderData.user.phoneNumber, // Use actual phone number from localOrderData
            products: localOrderData.items.map(item => ({
                product: item.productId.attributes?.productTitle || "NAN",
                quantity: item.quantity,
            })),
            totalprice: totalPrice
        };

        console.log('Submitting order data:', { data });

        try {
            const response = await axios.post('http://localhost:5555/api/baskets', { data });

            if (response.status === 200) {
                console.log('Order placed successfully:', response.data);

                // Remove products list from local storage
                const storedLocalOrderData = localStorage.getItem('orderData');
                if (storedLocalOrderData) {
                    const parsedData = JSON.parse(storedLocalOrderData);
                    parsedData.items = []; // Remove products list
                    localStorage.setItem('orderData', JSON.stringify(parsedData));
                }

                // Refresh the page
                window.location.reload();
            } else {
                console.error('Failed to place order:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting order:', error);
        }
    };



    return (
        <Container sx={{ my: 3, display: "flex", justifyContent: "space-between" }}>
            <Stack alignItems={"center"}>
                <ShoppingCartOutlined />
                <Typography variant="body2">Clean City</Typography>
            </Stack>

            <Stack direction={"row"} alignItems={"center"}>
                <Tooltip title="Order Information" arrow>
                    <IconButton>
                        <Person2OutlinedIcon />
                    </IconButton>
                </Tooltip>
                <IconButton
                    aria-label="cart"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                >
                    <Badge badgeContent={(orderData?.items?.length || 0) + (localOrderData?.items?.length || 0)} color="primary">
                        <ShoppingCartIcon />
                    </Badge>
                </IconButton>
            </Stack>

            <Popover
                sx={{ marginTop: 7 }}
                open={popoverOpen}
                anchorEl={anchorEl}
                onClose={handlePopoverClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                disableRestoreFocus
                onMouseEnter={handlePopoverOpen}
                onMouseLeave={handlePopoverClose}
            >
                <Box sx={{ p: 1, width: 300 }}>
                    <Typography variant="h6">Order Summary</Typography>

                    {/* Existing Orders */}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Orders History</Typography>
                        {existingOrder.map(order => (
                            <Paper key={order.id} elevation={2} sx={{ p: 2, mt: 1 }}>
                                <Typography variant="body2">Order ID: {order.id}</Typography>
                                <Typography variant="body2">Status: {order.submitted ? "Packed" : "Unpacked"}</Typography>
                                <Typography variant="body2">Total: {order.totalprice} DT</Typography>
                            </Paper>
                        ))}
                    </Box>

                    {/* New Orders */}
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>New Orders</Typography>
                        {localOrderData?.items && localOrderData.items.map((item, index) => (
                            <Paper key={index} elevation={2} sx={{ p: 2, mt: 1 }}>
                                <Typography variant="body2">Product Name: {item?.productId?.attributes?.productTitle}</Typography>
                                <Typography variant="body2">Quantity: {item.quantity}</Typography>
                                <Typography variant="body2">Total: {item.totalPrice} DT</Typography>
                            </Paper>
                        ))}
                    </Box>

                    {/* Submit Button */}
                    <Box sx={{ mt: 2, textAlign: 'center' }}>
                        {localOrderData?.items && <Button variant="contained" color="primary" onClick={handleOrderSubmit}>Submit Order</Button>}
                    </Box>
                </Box>
            </Popover>
        </Container>
    );
};

export default Header2;
