import React, { useState, useEffect } from "react";
import { Container, IconButton, Stack, Typography, Popover, Box, Badge, Tooltip, Button, Paper } from "@mui/material";
import { ShoppingCartOutlined, Person2Outlined, ShoppingCart } from "@mui/icons-material";
import axios from 'axios';

const Header2 = () => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [popoverOpen, setPopoverOpen] = useState(false);
    const [existingOrder, setExistingOrder] = useState([]);
    const [localOrderData, setLocalOrderData] = useState(null);
    const [view, setView] = useState('new'); // 'new' or 'history'

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
    }, [localOrderData]);

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
            email: localOrderData.user.email,
            phone: localOrderData.user.phoneNumber,
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

                // Clear local storage
                localStorage.removeItem('orderData');

                // Refresh the page
                window.location.reload();
            } else {
                console.error('Failed to place order:', response.statusText);
            }
        } catch (error) {
            console.error('Error submitting order:', error);
        }
    };

    const toggleView = (newView) => {
        setView(newView);
    };

    return (
        <Container sx={{ my: 4, display: "flex", justifyContent: "space-between" }}>
            <Stack alignItems={"center"}>
                <ShoppingCartOutlined />
                <Typography variant="h6">Clean City</Typography>
            </Stack>

            <Stack direction={"row"} alignItems={"center"}>
                <Tooltip title="Order Information" arrow>
                    <IconButton>
                        <Person2Outlined />
                    </IconButton>
                </Tooltip>
                <IconButton
                    aria-label="cart"
                    onMouseEnter={handlePopoverOpen}
                    onMouseLeave={handlePopoverClose}
                >
                    <Badge badgeContent={(localOrderData?.items?.length || 0)} color="primary">
                        <ShoppingCart />
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
                <Box sx={{ p: 2, width: 300 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>Order Summary</Typography>

                    {/* Switcher */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        <Button onClick={() => toggleView('new')} variant={view === 'new' ? "contained" : "outlined"} color="primary" sx={{ mr: 1 }}>New Orders</Button>
                        <Button onClick={() => toggleView('history')} variant={view === 'history' ? "contained" : "outlined"} color="primary" sx={{ ml: 1 }}>Order History</Button>
                    </Box>

                    {/* Orders */}
                    <Box>
                        {view === 'new' && (
                            <>
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>New Orders</Typography>
                                {localOrderData?.items && localOrderData.items.map((item, index) => (
                                    <Paper key={index} elevation={2} sx={{ p: 2, mt: 1 }}>
                                        <Typography variant="body2">Product Name: {item?.productId?.attributes?.productTitle}</Typography>
                                        <Typography variant="body2">Quantity: {item.quantity}</Typography>
                                        <Typography variant="body2">Total: {item.totalPrice} DT</Typography>
                                    </Paper>
                                ))}
                                <Box sx={{ mt: 2, textAlign: 'center' }}>
                                    {localOrderData?.items && <Button variant="contained" color="primary" onClick={handleOrderSubmit}>Submit Order</Button>}
                                </Box>
                            </>
                        )}
                        {view === 'history' && (
                            <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                                <>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Order History</Typography>
                                    {existingOrder.map(order => (
                                        <Paper key={order.id} elevation={2} sx={{ p: 2, mt: 1 }}>
                                            <Typography variant="body2">Order ID: {order.id}</Typography>
                                            <Typography variant="body2" sx={{ color: order.submitted ? 'green' : 'inherit' }}>Status: {order.submitted ? "Packed" : "Unpacked"}</Typography>
                                            <Typography variant="body2">Total: {order.totalprice} DT</Typography>
                                        </Paper>
                                    ))}
                                </>
                            </Box>
                        )}

                    </Box>
                </Box>
            </Popover>
        </Container>
    );
};

export default Header2;
